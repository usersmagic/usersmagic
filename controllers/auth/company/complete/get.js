const mongoose = require('mongoose');

const Company = require("../../../../models/company/Company");

module.exports = (req, res) => {
  let error = null;

  if (req.session && req.session.error) {
    error = req.session.error;
    req.session.error = null;
  }

  Company.findById(mongoose.Types.ObjectId(req.session.company._id), (err, company) => {
    if (err || !company) return res.redirect('/');

    if (company.completed)
      return res.redirect('/campaigns/company');

    return res.render('auth/company/complete', {
      page: 'auth/company/complete',
      title: res.__('Hesabını Tamamla'),
      includes: {
        external: ['css', 'js', 'fontawesome']
      },
      error,
      language_key: req.query.lang ? req.query.lang : null
    });
  });
}
