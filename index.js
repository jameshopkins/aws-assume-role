const STS = require("aws-sdk/clients/sts");
const help = require("./help");
const themed = require("./themed");

const argv = require("yargs").options(help).argv;

const Credentials = require("./credentials");
const { isErrorType } = require("./error");
const { getFileContents } = require("./file");
const invokeMfa = require("./mfa");

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  return themed.error(
    `⛔  You need to set both AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY as environment variables!`
  );
}

const configFile = getFileContents("config");

const profileName = argv.profile;

const credentials = new Credentials(profileName);

credentials.clear();

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

themed.notice(`🦄  Using profile ${profileName}`);

const storedProfile = credentials.get(profileName);

const config = {
  region: profile.region,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
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
    themed.error(
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
    themed.notice(`⏰  Credentials will be valid for ${argv.duration} secs`);
    credentials.process(data.Credentials);
  }
}

if (!storedProfile || storedProfile.expiration < currentTime) {
  // Naively attempt a role switch regardless of whether MFA maybe
  // attached to that IAM profile.
  sts.assumeRole({}, processResponseFromAssumeRole);
} else {
  const longevity = Math.round((storedProfile.expiration - currentTime) / 1000);
  themed.success(
    `👍  Existing credentials are valid for another ${longevity} seconds`
  );
  credentials.toStdOut();
}
