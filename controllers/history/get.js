const mongoose = require('mongoose');

const User = require('../../models/user/User');

module.exports = (req, res) => {
  User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
    if (err || !user) return res.redirect('/campaigns');

    return res.render('history/index', {
      page: 'history/index',
      title: 'Kampanya Geçmişi',
      includes: {
        external: ['css', 'fontawesome']
      },
      campaigns: user.campaigns
    });
  });
}
