const Application = require('../../models/application/Application');

module.exports = (req, res) => {
  if (!req.body || !req.body.name || !req.body.title || !req.body.area || !req.body.company_name || !req.body.phone || !req.body.link)
    return res.redirect('/');

  const newApplicationData = {
    name: req.body.name,
    title: req.body.title,
    area: req.body.area,
    company_name: req.body.company_name,
    phone: req.body.phone,
    link: req.body.link
  };

  const newApplication = new Application(newApplicationData);

  newApplication.save(err => {
    if (err) return res.redirect('/');

    return res.redirect('/');
  });
}
