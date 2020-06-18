const validator = require('validator');

const Tester = require('../../models/tester/Tester');

module.exports = (req, res) => {
  if (!req.body || !req.body.user_email || !req.body.user_name || !req.body.user_phone || !req.body.user_gender || !req.body.user_birth_day || !req.body.user_birth_month || !req.body.user_birth_year || !req.body.last_school || !req.body.user_profession)
    return res.redirect('/');

  if (!validator.isEmail(req.body.user_email))
    return res.redirect('/');
  
  const newTesterData = {
    email: req.body.user_email,
    phone: req.body.user_phone,
    name: req.body.user_name,
    gender: req.body.user_gender,
    birth_time: {
      day: req.body.user_birth_day,
      month: req.body.user_birth_month,
      year: req.body.user_birth_year
    },
    last_school: req.body.last_school,
    profession: req.body.user_profession
  };

  const newTester = new Tester(newTesterData);

  newTester.save((err, tester) => {
    if (err) return res.redirect('/');

    return res.redirect('/tester');
  });
}
