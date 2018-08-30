const color = require("colors-cli/safe");

module.exports.error = msg => console.error(color.red.bold(msg));
module.exports.success = msg => console.log(color.green_bt(msg));
module.exports.notice = msg => console.info(color.blue_bt(msg));
