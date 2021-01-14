const mongoose = require('mongoose');

const PrivateCampaign = require('../../../../../models/private_campaign/PrivateCampaign');
const Submition = require('../../../../../models/submition/Submition');
const User = require('../../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !req.body || !req.body.reason || !req.body.reason.length)
    return res.redirect('/admin');

  Submition.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {
    $set: {
      status: "unapproved",
      reject_message: req.body.reason,
      ended_at: (new Date()).getTime()
    }
  }, {}, (err, submition) => {
    if (err) return res.redirect('/admin');
  
    User.findByIdAndUpdate(mongoose.Types.ObjectId(submition.user_id), {$pull: {
      campaigns: submition.campaign_id
    }}, {}, err => {
      if (err) return res.redirect('/admin');

      PrivateCampaign.findByIdAndUpdate(mongoose.Types.ObjectId(submition.campaign_id), {$inc: {
        submition_limit: 1
      }}, {}, err => {
        if (err) return res.redirect('/admin');

        return res.redirect('/admin/private_campaigns/submitions?id=' + submition.campaign_id);
      });
    });
  });
}
