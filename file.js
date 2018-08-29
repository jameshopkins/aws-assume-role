const { readFileSync } = require("fs");
const { parse: parseConfig } = require("ini-parser");
const path = require("path");

const getFilePath = fileName => path.join(process.env.HOME, ".aws", fileName);

module.exports.getFileContents = fileName =>
  parseConfig(readFileSync(getFilePath(fileName), "utf8"));
