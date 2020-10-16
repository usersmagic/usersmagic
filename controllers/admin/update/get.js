const async = require('async');
const mongoose = require('mongoose');

const User = require('../../../models/user/User');

const sendMail = require('../../../utils/sendMail');

module.exports = (req, res) => {
  if (!req.query || !req.query.updates || req.query.updates != "new")
    return res.redirect('/');

  User.find({
    private_campaigns: "5f89e8f6673ead001c9ed286"
  }, (err, users) => {
    if (err) return res.redirect('/');

    async.times(
      users.length,
      (time, next) => {
        User.findByIdAndUpdate(mongoose.Types.ObjectId(users[time]._id), {$pull: {
          private_campaigns: "5f89e8f6673ead001c9ed286"
        }}, err => next(err));
      },
      err => {
        if (err) return res.redirect('/');

        return res.redirect('/admin');
      }
    )
  })
}
