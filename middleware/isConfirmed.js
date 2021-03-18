// Check if there is an account information on session, redirect to /auth/confirm if the request is not logged in

const User = require('../models/user/User');

module.exports = (req, res, next) => {
  User.getUserById(req.session.user._id, (err, user) => {
    if (err || !user)
      return res.status(401).redirect('/auth/login' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));
    
    if (!user.confirmed)
      return res.redirect('/auth/confirm' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));

    next();
  });
};
