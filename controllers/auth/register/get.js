module.exports = (req, res) => {
  let error = null;

  if (req.session && req.session.error) {
    error = req.session.error;
    req.session.destroy();
  }
  
  return res.render('auth/register', {
    page: 'auth/register',
    title: res.__('Kaydol'),
    includes: {
      external: ['css']
    },
    error
  });
}
