const color = require("colors-cli/safe");

process.stdin.setEncoding("utf8");

const userInput = color.green;

module.exports = cb => {
  console.log(userInput("Enter MFA Code:"));

  process.stdin.on("readable", () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      cb(chunk.trim());
    }
  });

  process.stdin.on("end", () => {
    process.stdout.write("end");
  });
};
