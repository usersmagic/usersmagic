const Application = require('../../models/application/Application');

module.exports = (req, res) => {
  if (!req.body || !req.body.user_name || !req.body.user_title || !req.body.business_area || !req.body.company_name || !req.body.company_phone || !req.body.company_link)
    return res.redirect('/');

  const newApplicationData = {
    name: req.body.user_name,
    title: req.body.user_title,
    area: req.body.business_area,
    company_name: req.body.company_name,
    phone: req.body.company_phone,
    link: req.body.company_link
  };

  const newApplication = new Application(newApplicationData);

  newApplication.save(err => {
    if (err) return res.redirect('/');

    return res.redirect('/');
  });
}
