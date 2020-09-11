const mongoose = require('mongoose');

const User = require('../models/user/User');

module.exports = (req, res, next) => {
  if (req.session && req.session.user) {
    User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
      if (err || !user)
        return res.redirect('/auth/user/login');;
      
      req.session.user = user;

      if (req.originalUrl != '/auth/user/complete' && !user.completed)
        return res.redirect('/auth/user/complete');

      next();
    });
  } else {
    req.session.redirect = req.originalUrl;
    res.redirect('/auth/user/login');
  };
};
