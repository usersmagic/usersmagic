const Company = require('../../../../models/company/Company');

module.exports = (req, res) => {
  if (!req.body || !req.body.email || !req.body.password)
    return res.redirect('/');

  Company.findCompany(req.body.email.trim(), req.body.password, (err, company) => {
    if (err || !company)
      return res.redirect('/auth/company/login');

    req.session.company = company;

    if (!company.completed)
      return res.redirect('/auth/company/complete');

    if (req.session.redirect)
      return res.redirect(req.session.redirect);
    else
      return res.redirect('/dashboard/company');
  });
}
