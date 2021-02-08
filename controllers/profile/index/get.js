// Get /profile

const Country = require('../../../models/country/Country');

module.exports = (req, res) => {
  const user = req.session.user;

  Country.getCountries((err, countries) => {
    if (err) return res.redirect('/');

    Country.getCountryWithAlpha2Code(user.country, (err, country) => {
      if (err) return res.redirect('/');
  
        return res.render('profile/index', {
          page: 'profile/index',
          title: res.__('Settings'),
          includes: {
            external: {
              css: ['page', 'fontawesome', 'navigation', 'general', 'buttons', 'inputs', 'confirm'],
              js: ['page', 'confirm', 'serverRequest', 'inputListeners']
            }
          }, 
          user,
          currency: country.currency,
          country,
          countries
        });
    });
  });
}
