const User = require('../../../models/user/User');

const sendMail = require('../../../utils/sendMail');

const generateRandomNumber = length => {
  let str = "";
  for (let i = 0; i < length; i++)
    str += (Math.floor(Math.random() * 10) + '0');
  return str;
}

module.exports = (req, res) => {
  if (!req.body || !req.body.email)
    return res.redirect('/auth/lost_password');

  User.findOneAndUpdate({
    email: req.body.email
  }, {$set: {
    password_reset_code: generateRandomNumber(11),
    password_reset_last_date: (new Date).getTime() + 3600000
  }}, {new: true}, (err, user) => {
    if (err || !user) {
      req.session.error = "bad request";
      return res.redirect('/auth/lost_password');
    }

    sendMail({
      email: user.email,
      code: user.password_reset_code
    }, 'change_password', err => {
      if (err) {
        console.log(err);
        req.session.error = "unknown";
        return res.redirect('/auth/lost_password');
      }

      req.session.error = 'completed';
      return res.redirect('/auth/lost_password');
    });
  });
}
