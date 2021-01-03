const mongoose = require('mongoose');

const User = require('../models/user/User');

module.exports = (req, res, next) => {
  User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
    if (err || !user) return res.status(401).redirect('/auth/login');
    
    if (user.city && user.town)
      return next();

    req.session.city_error = true;

    return res.redirect('/profile');
  })
}
