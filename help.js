module.exports = {
  profile: {
    demandOption: true,
    describe: "The profile that includes the role you want to assume",
    type: "string"
  },
  duration: {
    default: "3600",
    describe: "The duration of the session in seconds",
    type: "string"
  },
  cmd: {
    describe:
      "A CLI command that requires the specified assumed role, in order to work",
    type: "string"
  },
  "credentials-file-path": {
    describe: "The file path to the credentials cache",
    type: "string"
  },
  "credentials-file-name": {
    describe: "The file name of the credentials cache",
    type: "string"
  },
  "credentials-file-extension": {
    describe: "The file extension of the credentials cache",
    type: "string"
  }
};
