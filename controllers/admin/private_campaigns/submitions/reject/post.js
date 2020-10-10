const mongoose = require('mongoose');

const PrivateCampaign = require('../../../../../models/private_campaign/PrivateCampaign');
const User = require('../../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !req.query.user || !req.body || !req.body.reason)
    return res.redirect('/admin');

  PrivateCampaign.findById(mongoose.Types.ObjectId(req.query.id), (err, campaign) => {
    if (err || !campaign) return res.redirect('/admin');

    const submitions = campaign.submitions.filter(sub => sub.user_id.toString() != req.query.user);

    if (submitions.length == campaign.submitions.length)
      return res.redirect('/admin');
    
    PrivateCampaign.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {$set: {
      submitions
    }}, {}, err => {
      if (err) return res.redirect('/admin');

      User.findById(mongoose.Types.ObjectId(req.query.user), (err, user) => {
        if (err || !user) return res.redirect('/admin');

        const campaign_status = user.campaign_status;
        campaign_status[req.query.id] = "unapproved";
        const campaign_errors = user.campaign_errors;
        campaign_errors[req.query.id] = req.body.reason;

        User.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.user), {
          $set: {
            campaign_status,
            campaign_errors
          }
        }, {}, (err, user) => {
          if (err || !user) return res.redirect('/admin');

          return res.redirect('/admin/private_campaigns/submitions?id=' + req.query.id);
        });
      });
    });
  });
}
