// Get /filters page

const Country = require('../../../models/country/Country');
const User = require('../../../models/user/User');

module.exports = (req, res) => {
  const user = req.session.user;

  User.findCampaignsForUser(user._id, (err, campaigns) => {
    if (err) return res.redirect('/');

    Country.getCountryWithAlpha2Code(user.country, (err, country) => {
      if (err) return res.redirect('/');

      return res.render('filters/index', {
        page: 'filters/index',
        title: res.__('Filters'),
        includes: {
          external: {
            css: ['page', 'fontawesome', 'navigation', 'campaigns', 'general', 'buttons', 'confirm'],
            js: ['page', 'confirm']
          }
        },
        campaigns: campaigns,
        code: user._id.toString(),
        currency: country.currency
      });
    });
  });
}
