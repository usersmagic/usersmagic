const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../../models/campaign/Campaign');
const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)
    return res.redirect('/admin');

  Campaign.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {$set: {
    paused: false
  }}, {}, err => {
    if (err) return res.redirect('/admin');

    User.find({
      campaigns: req.query.id
    }, (err, users) => {
      if (err) return res.redirect('/admin');

      async.times(
        users.length,
        (time, next) => {
          if (campaign_status[req.query.id] == "approved")
            return next(null);

          const campaign_errors = users[time].campaign_errors;
          delete campaign_errors[req.query.id];
          const campaign_status = users[time].campaign_status;
          campaign_status[req.query.id] = "saved";

          User.findByIdAndUpdate(mongoose.Types.ObjectId(users[time]._id), {$set: {
            campaign_errors,
            campaign_status
          }}, {}, err => next(err));
        },
        err => {
          if (err) return res.redirect('/admin');

          return res.redirect('/admin/campaigns');
        }  
      );
    });
  });
}
