module.exports = (req, res) => {
  return res.render('auth/company/login', {
    page: 'auth/company/login',
    title: res.__('Giriş Yap'),
    includes: {
      external: ['css', 'fontawesome']
    },
    language_key: req.query.lang ? req.query.lang : null
  });
}
