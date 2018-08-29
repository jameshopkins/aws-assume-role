const STS = require("aws-sdk/clients/sts");
const argv = require("yargs").argv;
const { getFileContents, isErrorType } = require("./aws");
const invokeMfa = require("./mfa");

const configFile = getFileContents("config");

const profileName = argv.profile;

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

const sessionName = `profileName-${Date.now()}`;

console.log(`Using profile ${profileName}`);

const config = {
  region: profile.region,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  params: {
    RoleArn: profile.role_arn,
    RoleSessionName: sessionName,
    SerialNumber: profile.mfa_serial
  }
};

const sts = new STS(config);

function parseGeneratedCredentials(credentials) {
  const parsedCredentials = `
export AWS_ACCESS_KEY_ID=${credentials.AccessKeyId}
export AWS_SECRET_ACCESS_KEY=${credentials.SecretAccessKey}
export AWS_SESSION_TOKEN=${credentials.SessionToken}
  `;
  console.log(parsedCredentials);
}

function foo(err, data) {
  const isError = isErrorType(err);
  if (isError("noTokenCode")) {
    // Re-attempt the role switch with the inputted MFA token
    invokeMfa(code => {
      sts.assumeRole({ TokenCode: code }, (err, data) => {
        foo(err, data);
        process.exit();
      });
    });
  } else if (isError("incorrectTokenCode")) {
    throw new Error("Incorrect token code");
  }
  if (data) {
    parseGeneratedCredentials(data.Credentials);
  }
}

// Naively attempt a role switch regardless of whether MFA maybe
// attached to that IAM profile.
sts.assumeRole({}, foo);
