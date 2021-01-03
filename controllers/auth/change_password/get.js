const User = require('../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.email || !req.query.code)
    return res.redirect('/auth/login');

  let error = null;
  if (req.session && req.session.error) {
    error = req.session.error;
    req.session.destroy();
  }

  return res.render('auth/change_password', {
    page: 'auth/change_password',
    title: res.__('Yeni Şifre Girin'),
    includes: {
      external: ['css', 'fontawesome']
    },
    error,
    code: req.query.code,
    email: req.query.email,
    language_key: req.query.lang ? req.query.lang : null
  });
}
