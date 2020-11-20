const validator = require('validator');

const Application = require('../../models/application/Application');

module.exports = (req, res) => {
  if (!req.body || !req.body.name || !req.body.surname || !req.body.email || !validator.isEmail(req.body.email) || !req.body.company_name)
    return res.sendStatus(400);

  const newApplicationModel = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    company_name: req.body.company_name,
    details: req.body.details || null
  };

  const newApplication = new Application(newApplicationModel);

  newApplication.save(err => {
    if (err) return res.sendStatus(500);

    return res.sendStatus(200);
  });
}
