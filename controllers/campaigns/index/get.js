// Get /campaigns page

const Country = require('../../../models/country/Country');
const Target = require('../../../models/target/Target');

module.exports = (req, res) => {
  const user = req.session.user;

  Target.getProjectsUserCanJoin(user._id, (err, projects) => {
    if (err) return res.redirect('/');

    Country.getCountryWithAlpha2Code(user.country, (err, country) => {
      if (err) return res.redirect('/');

      let total = 0;

      for (let i = 0; i < projects.length; i++)
        total += parseInt(projects[i].price);

      return res.render('campaigns/index', {
        page: 'campaigns/index',
        title: res.__('Campaigns'),
        includes: {
          external: {
            css: ['page', 'fontawesome', 'navigation', 'campaigns', 'general', 'buttons', 'confirm'],
            js: ['page', 'confirm']
          }
        },
        campaigns: user.on_waitlist ? [] : projects,
        code: user._id.toString(),
        currency: country.currency,
        on_waitlist: user.on_waitlist,
        total
      });
    });
  });
}
