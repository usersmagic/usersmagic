const mongoose = require('mongoose');

const User = require('../../../models/user/User');

module.exports = (req, res) => {
  let error = null;
  let payment_error = null;

  if (req.session && req.session.error) {
    error = req.session.error;
    req.session.error = null;
  }

  if (req.session && req.session.payment_error) {
    payment_error = req.session.payment_error;
    req.session.payment_error = null;
  }

  User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
    if (err || !user) return res.redirect('/');

    return res.render('profile/index', {
      page: 'profile/index',
      title: 'Profil',
      includes: {
        external: ['css', 'js', 'fontawesome']
      },
      user,
      error,
      payment_error
    });
  })
}
