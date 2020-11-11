const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../../models/campaign/Campaign');
const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)
    return res.redirect('/admin');

  Campaign.findById(mongoose.Types.ObjectId(req.query.id), (err, campaign) => {
    if (err) return res.redirect('/admin');

    let submitions = campaign.submitions;

    async.times(
      Math.min(campaign.submitions.length, 30),
      (time, next) => {
        if (!campaign.submitions[time].user_id) {
          submitions = submitions.filter((sub, i) => i != time);
          return next(null);
        }

        const user_id = campaign.submitions[time].user_id;

        submitions = submitions.filter(sub => (sub.user_id && sub.user_id.toString() != user_id));

        User.findById(mongoose.Types.ObjectId(user_id), (err, user) => {
          if (err) return next(err);
          if (!user) return next(null);
    
          const campaign_status = user.campaign_status;
          campaign_status[req.query.id] = "approved";

          User.findByIdAndUpdate(mongoose.Types.ObjectId(user_id), {
            $set: { campaign_status },
            $inc: {
              credit: user.paid_campaigns.includes(req.query.id) ? 0 : campaign.price
            },
            $push: {
              paid_campaigns: req.query.id.toString()
            }
          }, {}, err => {
            if (err) return next(err);
    
            return next(null);
          });
        });
      },
      err => {
        if (err) return res.redirect('/admin');

        Campaign.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {$set: {
          submitions
        }}, {}, err => {
          if (err) return res.redirect('/admin');

          return res.redirect('/admin/submitions?id=' + req.query.id + '&version=1.0');
        });
      }
    );
  });
}
