module.exports = (req, res) => {
  let error = null;

  if (req.session && req.session.error) {
    error = req.session.error;
    req.session.error = null;
  }
  
  return res.render('auth/complete', {
    page: 'auth/complete',
    title: res.__('Hesabını Tamamla'),
    includes: {
      external: ['css', 'js']
    },
    error
  });
}
