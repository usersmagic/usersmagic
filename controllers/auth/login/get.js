module.exports = (req, res) => {
  return res.render('auth/login', {
    page: 'auth/login',
    title: 'Kaydol',
    includes: {
      external: ['css']
    }
  });
}
