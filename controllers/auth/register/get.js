// Get /auth/register page

module.exports = (req, res) => {
  return res.render('auth/register', {
    page: 'auth/register',
    title: res.__('Register'),
    includes: {
      external: {
        css: ['page', 'general', 'inputs', 'buttons', 'auth', 'fontawesome'],
        js: ['page', 'serverRequest']
      }
    },
    code: req.query && req.query.code ? req.query.code : null,
    language_key: req.query.lang ? req.query.lang : null
  });
}
