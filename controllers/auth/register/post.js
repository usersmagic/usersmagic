const validator = require('validator');

const User = require('../../../models/user/User');

module.exports = (req, res) => {
  if (!req.body || !req.body.email || !req.body.password || !req.body.password_confirm) {
    req.session.error = res.__('Lütfen bütün bilgileri girin');
    return res.redirect('/auth/register');
  }

  if (req.body.password.length < 6) {
    req.session.error = res.__('Şifreniz en az 6 haneli olmalıdır');
    return res.redirect('/auth/register');
  }

  if (req.body.password != req.body.password_confirm) {
    req.session.error = res.__('Lütfen şifrenizi tekrarlayın');
    return res.redirect('/auth/register');
  }

  if (!validator.isEmail(req.body.email)) {
    req.session.error = res.__('Girdiğiniz e-posta adresi geçerli değil');
    return res.redirect('/auth/register')
  }

  const newUserData = {
    email: req.body.email,
    password: req.body.password
  };

  const newUser = new User(newUserData);

  newUser.save((err, user) => {
    if (err && err.code == 11000) {
      req.session.error = res.__('Bu e-posta adresi zaten kayıtlı, lüfen başka bir adres deneyin');
      return res.redirect('/auth/register');
    }

    if (err) {
      req.session.error = res.__('Bilinmeyen bir hata oluştu, lütfen daha sonra tekrar deneyin');
      return res.redirect('/auth/register');
    }

    req.session.user = user;
    return res.redirect('/auth/complete');
  });
}