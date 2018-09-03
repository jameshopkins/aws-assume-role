const { spawn } = require("child_process");

const getCmdArgs = fragments => {
  if (fragments.length > 1) {
    return fragments.slice(1);
  }
  return [];
};

module.exports = (cmd, credentials) => {
  const cmdFragments = cmd.split(" ");
  const executedCmd = spawn(cmdFragments[0], getCmdArgs(cmdFragments), {
    cwd: process.cwd(),
    env: {
      ...process.env,
      AWS_ACCESS_KEY_ID: credentials.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: credentials.AWS_SECRET_ACCESS_KEY,
      AWS_SESSION_TOKEN: credentials.AWS_SESSION_TOKEN
    }
  });
  executedCmd.stdout.pipe(process.stdout);
  executedCmd.stderr.pipe(process.stderr);
};
