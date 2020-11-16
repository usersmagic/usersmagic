const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Campaign = require('../../../../models/campaign/Campaign');
const Submition = require('../../../../models/submition/Submition');
const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id_list || !req.query.campaign)
    return res.redirect('/admin');

  const ids = req.query.id_list.split(',');

  if (!ids.length || ids.filter(id => !id || !validator.isMongoId(id)).length)
    return res.redirect('/admin');

  Campaign.findById(mongoose.Types.ObjectId(req.query.campaign), (err, campaign) => {
    if (err) return res.redirect('/admin');

    async.times(
      ids.length,
      (time, next) => {
        Submition.findById(mongoose.Types.ObjectId(ids[time]), (err, submition) => {
          if (err) return next(err);

          User.findById(mongoose.Types.ObjectId(submition.user_id), (err, user) => {
            if (err) return next(err);

            const information = user.information;
    
            Object.keys(submition.answers).forEach((id, index) => {
              information[id] = Object.values(submition.answers)[index];
            });
      
            User.findByIdAndUpdate(mongoose.Types.ObjectId(submition.user_id), {
              $set: {
                information
              },
              $inc: {
                credit: user.paid_campaigns.includes(submition.campaign_id) ? 0 : campaign.price
              },
              $push: {
                paid_campaigns: submition.campaign_id
              }
            }, {}, (err, user) => {
              if (err || !user) return next(err || true)
    
              Submition.findByIdAndUpdate(mongoose.Types.ObjectId(ids[time]), {$set: {
                status: "approved",
                ended_at: (new Date()).getTime()
              }}, {}, err => {
                if (err) return next(err);
    
                return next(null);
              });
            });
          });  
        });
      },
      err => {
        if (err) return res.redirect('/admin');
        
        return res.redirect(`/admin/submitions?id=${req.query.campaign}&version=1.0`);
      }
    );
  });
}
