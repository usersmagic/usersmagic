module.exports = (req, res) => {
  return res.render('auth/login', {
    page: 'auth/login',
    title: res.__('Login'),
    includes: {
      external: {
        css: ['page', 'general', 'inputs', 'buttons', 'auth', 'fontawesome'],
        js: ['page', 'serverRequest']
      }
    },
    language_key: req.query.lang ? req.query.lang : null
  });
}
