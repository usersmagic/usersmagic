const User = require('../../../models/user/User');

module.exports = (req, res) => {
  if (!req.body || !req.body.email || !req.body.password)
    return res.redirect('/');

  User.findUser(req.body.email.trim(), req.body.password, (err, user) => {
    if (err || !user)
      return res.redirect('/auth/login' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));

    req.session.user = user;

    if (!user.completed)
      return res.redirect('/auth/complete' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));

    if (req.session.redirect)
      return res.redirect(req.session.redirect);
    else
      return res.redirect('/campaigns' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));
  });
}
