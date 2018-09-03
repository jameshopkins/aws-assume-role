const Conf = require("conf");
const executeCmd = require("./cmd");

class Credentials extends Conf {
  constructor(profileName) {
    super();
    this.profileName = profileName;
    this.credentials = this.get(this.profileName);
  }
  toStdOut() {
    const {
      AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY,
      AWS_SESSION_TOKEN
    } = this.credentials;
    const formatted = `
export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
export AWS_SESSION_TOKEN=${AWS_SESSION_TOKEN}`;
    console.log(formatted);
  }
  process(credentials) {
    const {
      AccessKeyId,
      SecretAccessKey,
      SessionToken,
      Expiration
    } = credentials;

    const parsedCredentials = {
      AWS_ACCESS_KEY_ID: AccessKeyId,
      AWS_SECRET_ACCESS_KEY: SecretAccessKey,
      AWS_SESSION_TOKEN: SessionToken,
      expiration: new Date(Expiration).getTime()
    };

    this.set(this.profileName, parsedCredentials);
  }
  apply(cmd) {
    if (cmd) {
      executeCmd(cmd, this.credentials);
    } else {
      this.toStdOut();
    }
  }
}

module.exports = Credentials;
