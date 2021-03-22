// Get /auth/complete page

const Country = require('../../../models/country/Country');

module.exports = (req, res) => {
  if (req.session.user.completed)
    return res.redirect('/campaigns');

  Country.getCountries((err, countries) => {
    if (err) return res.redirect('/');

    return res.render('auth/complete', {
      page: 'auth/complete',
      title: res.__('Complete Your Account'),
      includes: {
        external: {
          css: ['page', 'general', 'inputs', 'buttons', 'auth', 'fontawesome'],
          js: ['page', 'serverRequest', 'inputListeners']
        }
      },
      user: req.session.user,
      countries,
      genders: [
        {name: 'Female', id: 'female'},
        {name: 'Male', id: 'male'},
        {name: 'Other', id: 'other'},
        {name: 'Prefer not to say', id: 'not_specified'}
      ],
      language_key: req.query.lang ? req.query.lang : null
    });
  });
}
