const async = require('async');
const mongoose = require('mongoose');

const Commercial = require('../../../../models/commercial/Commercial');
const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)
    return res.redirect('/admin');

  Commercial.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {$set: {
    deleted: true
  }}, {new: true}, (err, commercial) => {
    if (err) return res.redirect('/admin');

    User.find({
      commercials: commercial._id.toString()
    }, (err, users) => {
      if (err) return res.redirect('/admin');

      async.times(
        users.length,
        (time, next) => {
          User.findByIdAndUpdate(mongoose.Types.ObjectId(users[time]._id), {$pull: {
            commercials: commercial._id.toString()
          }}, {}, err => next(err));
        },
        err => {
          if (err) return res.redirect('/admin');

          return res.redirect('/admin/commercials');
        }
      )
    });
  })
}
