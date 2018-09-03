const color = require("colors-cli/safe");
const readline = require("readline");

const userInput = color.green;

module.exports = cb => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Enter MFA Code: ", token => {
    cb(token);
    rl.close();
  });
};
