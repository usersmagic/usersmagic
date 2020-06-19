const validator = require('validator');

const Tester = require('../../models/tester/Tester');

module.exports = (req, res) => {
  if (!req.body || !req.body.email || !req.body.name || !req.body.phone || !req.body.gender || !req.body.birth_time || !req.body.birth_time.day || !req.body.birth_time.month || !req.body.birth_time.year || !req.body.last_school || !req.body.profession)
    return res.sendStatus(400);

  if (!validator.isEmail(req.body.email))
    return res.sendStatus(400);
  
  const newTesterData = {
    email: req.body.email,
    phone: req.body.phone,
    name: req.body.name,
    gender: req.body.gender,
    birth_time: {
      day: req.body.birth_time.day,
      month: req.body.birth_time.month,
      year: req.body.birth_time.year
    },
    last_school: req.body.last_school,
    profession: req.body.profession
  };

  const newTester = new Tester(newTesterData);

  newTester.save((err, tester) => {
    if (err) return res.sendStatus(500);;

    return res.sendStatus(200);
  });
}
