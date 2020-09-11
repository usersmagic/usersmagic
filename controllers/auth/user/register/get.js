module.exports = (req, res) => {
  let error = null;
  if (req.session && req.session.error) {
    error = req.session.error;
    req.session.destroy();
  }
  
  return res.render('auth/user/register', {
    page: 'auth/user/register',
    title: res.__('Kaydol'),
    includes: {
      external: ['css', 'fontawesome']
    },
    error,
    invitor: req.query && req.query.code ? req.query.code : null,
    language_key: req.query.lang ? req.query.lang : null
  });
}
