const async = require('async');
const mongoose = require('mongoose');

const User = require('../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.updates)
    return res.redirect('/');

  User.find({ $and: [
    { "information.5f613e90dd11cf00161bc632": { $exists: true } },
    { "information.5f613eefdd11cf00161bc633": { $exists: true } },
    { "information.5f613f44dd11cf00161bc634": { $exists: true } },
    { "information.5f613f98dd11cf00161bc636": { $exists: true } },
    { "information.5f613ff7dd11cf00161bc637": { $exists: true } },
  ] }, (err, users) => {
    if (err) console.log(err);
    if (err) return res.redirect('/');

    async.times(
      users.length,
      (time, next) => {
        User.findByIdAndUpdate(mongoose.Types.ObjectId(users[time]._id), {$inc: {
          credit: 1
        }}, {}, err => next(err));
      },
      err => {
        if (err) return res.redirect('/');

        return res.redirect('/admin');
      }
    );
  });
}
