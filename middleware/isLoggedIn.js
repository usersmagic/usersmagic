const mongoose = require('mongoose');

const User = require('../models/user/User');

module.exports = (req, res, next) => {
  if (req.session && req.session.user) {
    User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
      if (err || !user)
        return res.status(401).redirect('/auth/user/login' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));;
      
      req.session.user = user;

      if ((req.originalUrl.indexOf('?') > -1 ? req.originalUrl.substr(0, req.originalUrl.indexOf('?')) : req.originalUrl) != '/auth/user/complete' && !user.completed)
        return res.redirect('/auth/user/complete' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));

      next();
    });
  } else {
    req.session.redirect = req.originalUrl;
    res.status(401).redirect('/auth/user/login' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));
  };
};
