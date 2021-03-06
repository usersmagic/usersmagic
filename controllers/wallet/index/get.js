// Get /wallet

const Country = require('../../../models/country/Country');

module.exports = (req, res) => {
  const user = req.session.user;
  
  Country.getCountryWithAlpha2Code(user.country, (err, country) => {
    if (err) return res.redirect('/');

      return res.render('wallet/index', {
        page: 'wallet/index',
        title: res.__('Wallet'),
        includes: {
          external: {
            css: ['page', 'fontawesome', 'navigation', 'general', 'buttons', 'inputs', 'confirm'],
            js: ['page', 'confirm', 'serverRequest']
          }
        }, 
        user,
        country,
        currency: country.currency
      });
  });
}
