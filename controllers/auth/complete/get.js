// Get /auth/complete page

module.exports = (req, res) => {
  return res.render('auth/complete', {
    page: 'auth/complete',
    title: res.__('Complete Your Account'),
    includes: {
      external: {
        css: ['page', 'fontawesome'],
        js: ['page']
      }
    },
    user: req.session.user
  });
}
