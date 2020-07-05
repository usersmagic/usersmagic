const async = require('async');
const mongoose = require('mongoose');

const User = require('../../../../models/user/User');
const Campaign = require('../../../../models/campaign/Campaign');

const deletePhoto = require('../../../../utils/deletePhoto');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)
    return res.redirect('/admin');

  Campaign.findById(mongoose.Types.ObjectId(req.query.id), (err, campaign) => {
    if (err || !campaign) return res.redirect('/admin');

    async.times(
      campaign.participants.length,
      (time, next) => {
        User.findById(mongoose.Types.ObjectId(campaign.participants[time]), (err, user) => {
          if (err) return next(err);

          User.findByIdAndUpdate(mongoose.Types.ObjectId(campaign.participants[time]), {$set: {
            campaigns: user.campaigns.filter(cam => cam._id.toString() != req.query.id),
            campaign_ids: user.campaign_ids.filter(cam => cam.toString() != req.query.id)
          }}, {}, err => next(err));
        });
      },
      err => {
        if (err) return res.redirect('/admin');

        Campaign.findByIdAndDelete(mongoose.Types.ObjectId(req.query.id), err => {
          if (err) return res.redirect('/admin');

          deletePhoto(campaign.photo, err => {
            if (err) return res.redirect('/admin');

            return res.redirect('/admin/campaigns');
          });
        });
      }
    );
  });
}
