const mongoose = require('mongoose');

const User = require('../../../../models/user/User');
const Campaign = require('../../../../models/campaign/Campaign');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !req.query.user)
    return res.redirect('/admin');

  Campaign.findById(mongoose.Types.ObjectId(req.query.id), (err, campaign) => {
    if (err || !campaign) return res.redirect('/admin');

    const submitions = campaign.submitions.filter(sub => sub.user_id.toString() != req.query.user);

    if (submitions.length == campaign.submitions.length)
      return res.redirect('/admin');

    User.findById(mongoose.Types.ObjectId(req.query.user), (err, user) => {
      if (err || !user) return res.redirect('/admin');

      Campaign.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {
        $set: {
          submitions
        },
        $push: {
          accepted_submitions: user._id.toString()
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

          return res.redirect('/admin/submitions?id=' + req.query.id + '&version=1');
        });
      });
    });
  });
}
