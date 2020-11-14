const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Campaign = require('../../../../models/campaign/Campaign');
const User = require('../../../../models/user/User');
const Submition = require('../../../../models/submition/Submition');

module.exports = (req, res) => {
  if (!req.query || !req.query.id_list || !req.query.campaign)
    return res.redirect('/admin');

  const ids = req.query.id_list.split(',');

  if (!ids.length || ids.filter(id => !id || !validator.isMongoId(id)).length)
    return res.redirect('/admin');

  Campaign.findById(mongoose.Types.ObjectId(req.query.campaign), (err, campaign) => {
    async.times(
      ids.length,
      (time, next) => {
        Submition.findById(ids[time], (err, submition) => {
          if (err) return next();
          if (submition.campaign_id != campaign._id.toString()) return next();
  
          User.findById(mongoose.Types.ObjectId(submition.user_id), (err, user) => {
            if (err || !user) return next();
            
            User.findByIdAndUpdate(mongoose.Types.ObjectId(submition.user_id), {
              $set: {
                ["campaign_status." + submition.campaign_id]: "approved",
                ["campaign_approve_date." + submition.campaign_id]: (new Date).getTime()
              },
              $inc: {
                credit: user.paid_campaigns.includes(submition.campaign_id.toString()) ? 0 : campaign.price
              },
              $push: {
                paid_campaigns: submition.campaign_id.toString()
              }
            }, {}, err => {
              if (err) return next();
      
              Submition.findByIdAndDelete(ids[time], () => {
                return next();
              });
            });
          });
        });
      },
      () => {
        return res.redirect(`/admin/submitions?id=${req.query.campaign}&version=1.0`);
      }
    );
  });
}
