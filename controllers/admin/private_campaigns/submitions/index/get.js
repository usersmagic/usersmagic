const async = require('async');
const mongoose = require('mongoose');

const PrivateCampaign = require('../../../../../models/private_campaign/PrivateCampaign');
const User = require('../../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)
    return res.redirect('/admin');
  
  PrivateCampaign.findById(mongoose.Types.ObjectId(req.query.id), (err, campaign) => {
    if (err || !campaign) return res.redirect('/admin');

    async.times(
      Math.min(campaign.submitions.length, 50),
      (time, next) => {
        User.findById(mongoose.Types.ObjectId(campaign.submitions[time].user_id), (err, user) => {
          if (!user || !user.name) return next(null);

          next(err, {
            user,
            answers: campaign.submitions[time].answers
          })
        });
      },
      (err, newSubmitions) => {
        if (err) return res.redirect('/admin');

        return res.render('admin/private_campaigns/submitions', {
          page: 'admin/private_campaigns/submitions',
          title: campaign.name,
          includes: {
            external: ['css', 'admin_general_css', 'fontawesome']
          },
          campaign,
          submitions: newSubmitions.filter(each => each && each.user && each.user._id),
          version: req.query.version
        });
      }
    );
  });
}
