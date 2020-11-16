const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../../models/campaign/Campaign');
const User = require('../../../../models/user/User');
const Submition = require('../../../../models/submition/Submition');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)
    return res.redirect('/admin');

  Submition.findById(mongoose.Types.ObjectId(req.query.id), (err, submition) => {
    if (err) return res.redirect('/admin');

    Campaign.findById(mongoose.Types.ObjectId(submition.campaign_id), (err, campaign) => {
      if (err) return res.redirect('/admin');

      User.findById(mongoose.Types.ObjectId(submition.user_id), (err, user) => {
        if (err) return res.redirect('/admin');

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
          if (err || !user) return res.redirect('/admin');

          Submition.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {$set: {
            status: "approved",
            ended_at: (new Date()).getTime()
          }}, {}, err => {
            if (err) return res.redirect('/admin');

            return res.redirect('/admin/submitions?id=' + submition.campaign_id);
          });
        });
      });
    });
  });
}
