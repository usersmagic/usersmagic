module.exports = (req, res) => {
  let error = null;

  if (req.session && req.session.error) {
    error = req.session.error;
    req.session.error = null;
  }
  
  return res.render('auth/complete', {
    page: 'auth/complete',
    title: 'Hesabını Tamamla',
    includes: {
      external: ['css']
    },
    error
  });
}
