const User = require('../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.email || !req.query.code)
    return res.redirect('/auth/login');

  if (!req.body || !req.body.password || !req.body.password_confirm) {
    req.session.error = "bad request";
    return res.redirect(`/auth/change_password?email=${req.query.email}&code=${req.query.code}`);
  }

  if (req.body.password.length < 6) {
    req.session.error = "short password";
    return res.redirect(`/auth/change_password?email=${req.query.email}&code=${req.query.code}`);
  }

  if (req.body.password != req.body.password_confirm) {
    req.session.error = "confirm password";
    return res.redirect(`/auth/change_password?email=${req.query.email}&code=${req.query.code}`);
  }

  User.findOne({
    email: req.query.email,
    password_reset_code: req.query.code
  }, (err, user) => {
    if (err || !user)  {
      req.session.error = "bad request";
      return res.redirect(`/auth/change_password?email=${req.query.email}&code=${req.query.code}`);
    }

    if (user.password_reset_last_date < (new Date).getTime()) {
      req.session.error = "late request";
      return res.redirect(`/auth/change_password?email=${req.query.email}&code=${req.query.code}`);
    }

    user.password = req.body.password;
    user.password_reset_code = null;
    user.password_reset_last_date = null;

    user.save(err => {
      if (err) {
        req.session.error = "unknown";
        return res.redirect(`/auth/change_password?email=${req.query.email}&code=${req.query.code}`);
      }

      return res.redirect('/auth/login');
    });
  });
}
