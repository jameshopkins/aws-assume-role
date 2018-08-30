const STS = require("aws-sdk/clients/sts");
const argv = require("yargs").argv;
const Credentials = require("./credentials");
const { isErrorType } = require("./error");
const { getFileContents } = require("./file");
const invokeMfa = require("./mfa");

const configFile = getFileContents("config");

const profileName = argv.profile;

const credentials = new Credentials(profileName);

const getProfileConfig = (config, role) => {
  const profileKey = Object.keys(config).filter(directive =>
    directive.includes(role)
  )[0];
  return configFile[profileKey];
};

const profile = getProfileConfig(configFile, profileName);

if (!profile) {
  throw new Error(`Couldn\'t find ${profileName} profile`);
}

const currentTime = Date.now();
const sessionName = `profileName-${currentTime}`;

console.log(`Using profile ${profileName}`);

const storedProfile = credentials.get(profileName);

const config = {
  region: profile.region,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  params: {
    RoleArn: profile.role_arn,
    RoleSessionName: sessionName,
    SerialNumber: profile.mfa_serial,
    DurationSeconds: argv.duration
  }
};

const sts = new STS(config);

function processResponseFromAssumeRole(err, data) {
  const isError = isErrorType(err);
  if (isError("validationDuratiion")) {
    console.error(
      `Duration of ${
        argv.duration
      } seconds is invalid. Value can range from 900 seconds to the maximum session duration setting for the ${profileName} role`
    );
  }
  if (isError("noTokenCode")) {
    // Re-attempt the role switch with the inputted MFA token
    invokeMfa(token => {
      sts.assumeRole({ TokenCode: token }, (err, data) => {
        processResponseFromAssumeRole(err, data);
        process.exit();
      });
    });
  }
  if (isError("incorrectTokenCode")) {
    console.error("Incorrect token code");
  }
  if (data) {
    credentials.process(data.Credentials);
  }
}

if (!storedProfile || storedProfile.expiration < currentTime) {
  // Naively attempt a role switch regardless of whether MFA maybe
  // attached to that IAM profile.
  sts.assumeRole({}, processResponseFromAssumeRole);
} else {
  credentials.toStdOut();
}
