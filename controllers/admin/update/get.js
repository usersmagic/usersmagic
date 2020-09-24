const async = require('async');
const mongoose = require('mongoose');

const User = require('../../../models/user/User');
const Campaign = require('../../../models/campaign/Campaign');

module.exports = (req, res) => {
  if (!req.query || !req.query.updates)
    return res.redirect('/');

  Campaign.find({}, (err, campaigns) => {
    if (err) return res.redirect('/');

    async.times(
      campaigns.length,
      (time, next) => {
        Campaign.findById(mongoose.Types.ObjectId(campaigns[time]._id), (err, campaign) => {
          if (err) return next(err);

          Campaign.findByIdAndUpdate(mongoose.Types.ObjectId(campaign._id), {$set: {
            submitions: campaign.submitions.filter(each => each.user_id)
          }}, {}, err => next(err));
        });
      },
      err => {
        if (err) return res.redirect('/');

        return res.redirect('/admin');
      }
    )
  });
}
