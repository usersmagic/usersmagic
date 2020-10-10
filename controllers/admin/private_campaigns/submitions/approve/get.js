const mongoose = require('mongoose');

const PrivateCampaign = require('../../../../../models/private_campaign/PrivateCampaign');
const User = require('../../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !req.query.user)
    return res.redirect('/admin');

  PrivateCampaign.findById(mongoose.Types.ObjectId(req.query.id), (err, campaign) => {
    if (err) return res.redirect('/admin');

    const acceptedSubmition = campaign.submitions.find(sub => sub.user_id.toString() == req.query.user);
    const submitions = campaign.submitions.filter(sub => sub.user_id.toString() != req.query.user);

    User.findById(mongoose.Types.ObjectId(req.query.user), (err, user) => {
      if (err || !user) return res.redirect('/admin');

      PrivateCampaign.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {
        $set: {
          submitions
        },
        $push: {
          accepted_submitions: acceptedSubmition
        }
      }, {}, err => {
        if (err) return res.redirect('/admin');

        const campaign_status = user.campaign_status;
        campaign_status[req.query.id] = "approved";
        
        User.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.user), {
          $set: { campaign_status },
          $inc: {
            credit: user.paid_campaigns.includes(req.query.id) ? 0 : campaign.price
          },
          $push: {
            paid_campaigns: req.query.id.toString()
          }
        }, {}, (err, user) => {
          if (err || !user) return res.redirect('/admin');

          return res.redirect('/admin/private_campaigns/submitions?id=' + req.query.id);
        });
      });
    });
  })
}
