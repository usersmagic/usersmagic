const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../../models/campaign/Campaign');
const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)
    return res.redirect('/admin');

  Campaign.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {$set: {
    paused: false
  }}, {}, (err, campaign) => {
    if (err) return res.redirect('/admin');

    User.find({
      campaigns: req.query.id,
      _id: { $nin: campaign.accepted_submitions }
    }, (err, users) => {
      if (err) return res.redirect('/admin');

      async.times(
        users.length,
        (time, next) => {
          const new_campaign_errors = users[time].campaign_errors;
          delete new_campaign_errors[req.query.id];

          User.findByIdAndUpdate(mongoose.Types.ObjectId(users[time]._id), {$set: {
            campaign_errors: new_campaign_errors
          }}, {}, err => {
            return next(err);
          });
        },
        err => {
          if (err) return res.redirect('/admin');

          return res.redirect('/admin/campaigns');
        }  
      );
    });
  });
}
