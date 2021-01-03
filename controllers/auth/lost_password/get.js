module.exports = (req, res) => {
  let error = null;
  if (req.session && req.session.error) {
    error = req.session.error;
    req.session.destroy();
  }
  
  return res.render('auth/lost_password', {
    page: 'auth/lost_password',
    title: res.__('Şifreni Değiştir'),
    includes: {
      external: ['css', 'fontawesome']
    },
    error,
    language_key: req.query.lang ? req.query.lang : null
  });
}
