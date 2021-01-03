const validator = require('validator');

module.exports = (newCompanyData, callback) => {
  if (!newCompanyData || !newCompanyData.email || !newCompanyData.email.length || !newCompanyData.password || !newCompanyData.password.length || !newCompanyData.confirmPassword || !newCompanyData.confirmPassword.length)
    return callback('bad_request');

  if (!validator.isEmail(newCompanyData.email))
    return callback('email_validation');

  if (newCompanyData.password.length < 6)
    return callback('password_length');

  if (newCompanyData.password != newCompanyData.confirmPassword)
    return callback('password_confirm');

  return callback(null, {
    email: newCompanyData.email,
    password: newCompanyData.password
  });
}
