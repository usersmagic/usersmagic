const mongoose = require('mongoose');

const PrivateCampaign = require('../../../../../models/private_campaign/PrivateCampaign');
const Submition = require('../../../../../models/submition/Submition');
const User = require('../../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)
    return res.redirect('/admin');

  Submition.findById(mongoose.Types.ObjectId(req.query.id), (err, submition) => {
    if (err) return res.redirect('/admin');

    PrivateCampaign.findById(mongoose.Types.ObjectId(submition.campaign_id), (err, campaign) => {
      if (err) return res.redirect('/admin');

      User.findByIdAndUpdate(mongoose.Types.ObjectId(submition.user_id), {
        $inc: {
          credit: user.paid_campaigns.includes(submition.campaign_id) ? 0 : campaign.price
        },
        $push: {
          paid_campaigns: submition.campaign_id
        }
      }, {}, err => {
        if (err) return res.redirect('/admin');

        Submition.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {$set: {
          status: "approved",
          ended_at: (new Date()).getTime()
        }}, {}, err => {
          if (err) return res.redirect('/admin');

          return res.redirect('/admin/private_campaigns/submitions?id=' + submition.campaign_id);
        });
      });
    });
  });
}
