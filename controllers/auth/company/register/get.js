module.exports = (req, res) => {
  let error = null;
  if (req.session && req.session.error) {
    error = req.session.error;
    req.session.destroy();
  }
  
  return res.render('auth/company/register', {
    page: 'auth/company/register',
    title: res.__('Hesap Aç'),
    includes: {
      external: ['css', 'fontawesome']
    },
    error,
    language_key: req.query.lang ? req.query.lang : null
  });
}
