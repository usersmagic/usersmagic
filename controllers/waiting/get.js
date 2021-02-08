// Get /waiting page

const Country = require('../../models/country/Country');
const User = require('../../models/user/User');

module.exports = (req, res) => {
  const user = req.session.user;

  User.getInReviewSubmitionsOfUser(user._id, (err, submitions) => {
    if (err) return res.redirect('/');

    Country.getCountryWithAlpha2Code(user.country, (err, country) => {
      if (err) return res.redirect('/');

      return res.render('waiting/index', {
        page: 'waiting/index',
        title: res.__('In Review'),
        includes: {
          external: {
            css: ['page', 'fontawesome', 'navigation', 'campaigns', 'buttons', 'general', 'confirm'],
            js: ['page', 'confirm']
          }
        },
        submitions: submitions,
        code: user._id.toString(),
        currency: country.currency
      });
    });
  });
}
