const { exec } = require("child_process");

const getCmdArgs = fragments => {
  if (fragments.length > 1) {
    return fragments.slice(1);
  }
  return [];
};

module.exports = (cmd, credentials) => {
  console.log(cmd);
  const executedCmd = exec(
    cmd,
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        AWS_ACCESS_KEY_ID: credentials.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: credentials.AWS_SECRET_ACCESS_KEY,
        AWS_SESSION_TOKEN: credentials.AWS_SESSION_TOKEN
      }
    },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    }
  );
};
