const { readFileSync } = require("fs");
const { parse: parseConfig } = require("ini-parser");
const path = require("path");

const getFilePath = fileName => path.join(process.env.HOME, ".aws", fileName);

const errors = {
  noTokenCode: "provide both MFA serial number and one time pass code",
  incorrectTokenCode: "invalid MFA one time pass code"
};

module.exports.isErrorType = err => type => err.message.includes(errors[type]);

module.exports.getFileContents = fileName =>
  parseConfig(readFileSync(getFilePath(fileName), "utf8"));
