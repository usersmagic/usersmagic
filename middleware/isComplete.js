// Check if there is an account information on session, redirect to /auth/login if the request is not logged in

const User = require('../models/user/User');

module.exports = (req, res, next) => {
  User.getUserById(req.session.user._id, (err, user) => {
    if (err || !user)
      return res.status(401).redirect('/auth/login' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));
    
    if (!user.completed)
      return res.redirect('/auth/complete' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));

    next();
  });
};
