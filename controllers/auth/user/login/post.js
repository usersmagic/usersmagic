const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.body || !req.body.email || !req.body.password)
    return res.redirect('/');

  User.findUser(req.body.email.trim(), req.body.password, (err, user) => {
    if (err || !user)
      return res.redirect('/auth/user/login' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));

    req.session.user = user;

    if (!user.completed)
      return res.redirect('/auth/user/complete' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));

    if (req.session.redirect)
      return res.redirect(req.session.redirect);
    else
      return res.redirect('/campaigns/user' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));
  });
}
