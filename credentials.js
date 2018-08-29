const Conf = require("conf");

class Credentials extends Conf {
  constructor(profileName) {
    super();
    this.profileName = profileName;
  }
  toStdOut() {
    const { accessKeyId, secretAccessKey, sessionToken } = this.get(
      this.profileName
    );
    const formatted = `
AWS_ACCESS_KEY_ID=${accessKeyId}
AWS_SECRET_ACCESS_KEY=${secretAccessKey}
AWS_SESSION_TOKEN=${sessionToken}
    `;
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
      accessKeyId: AccessKeyId,
      secretAccessKey: SecretAccessKey,
      sessionToken: SessionToken,
      expiration: new Date(Expiration).getTime()
    };

    this.set(this.profileName, parsedCredentials);
    this.toStdOut();
  }
}

module.exports = Credentials;
