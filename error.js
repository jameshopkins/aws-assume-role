const errors = {
  noTokenCode: val =>
    val.includes("provide both MFA serial number and one time pass code"),
  incorrectTokenCode: val => val.includes("invalid MFA one time pass code"),
  validationDuration: val => val.includes("durationSeconds"),
  validationMFA: val => val.includes("'tokenCode' failed"),
  signatureMismatch: val => val.includes("request signature")
};

module.exports.isErrorType = err => type => err && errors[type](err.message);
