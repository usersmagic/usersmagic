const Company = require('../../models/company/Company');

module.exports = (req, res) => {
  if (!req.body || !req.body.name || !req.body.title || !req.body.business || !req.body.company || !req.body.phone || !req.body.link)
    return res.sendStatus(400);

  const newCompanyData = {
    name: req.body.name,
    title: req.body.title,
    area: req.body.business,
    company_name: req.body.company,
    phone: req.body.phone,
    link: req.body.link
  };

  const newCompany = new Company(newCompanyData);

  newCompany.save(err => {
    if (err) return res.sendStatus(500);

    return res.sendStatus(200);
  });
}
