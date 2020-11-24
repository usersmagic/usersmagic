const mongoose = require('mongoose');

const User = require("../../../../models/user/User");

module.exports = (req, res) => {
  let error = null;
  
  if (req.session && req.session.error) {
    error = req.session.error;
    req.session.error = null;
  }

  User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
    if (err || !user) return res.redirect('/' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));

    if (user.completed)
      return res.redirect('/campaigns/user' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));

    return res.render('auth/user/complete', {
      page: 'auth/user/complete',
      title: res.__('Hesabını Tamamla'),
      includes: {
        external: ['css', 'js', 'fontawesome']
      },
      error,
      language_key: req.query.lang ? req.query.lang : null
    });
  });
}
