const errors = {
  noTokenCode: "provide both MFA serial number and one time pass code",
  incorrectTokenCode: "invalid MFA one time pass code"
};

module.exports.isErrorType = err => type =>
  err && err.message.includes(errors[type]);