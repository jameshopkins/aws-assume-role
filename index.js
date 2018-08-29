const STS = require("aws-sdk/clients/sts");
const argv = require("yargs").argv;
const { getFileContents, isErrorType } = require("./aws");
const mfa = require("./mfa");
const AssumeRole = require("./assume");

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

function foo(err, data) {
  const isError = isErrorType(err);
  if (isError("noTokenCode")) {
    console.log("Enter MFA Code:");
    sts.assumeRole({ TokenCode: "898890" }, foo);
  } else if (isError("incorrectTokenCode")) {
    console.log("Incorrect token code");
  }
}

sts.assumeRole({}, foo);
