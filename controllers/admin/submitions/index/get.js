const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../../models/campaign/Campaign');
const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !req.query.version)
    return res.redirect('/admin');

  Campaign.findById(mongoose.Types.ObjectId(req.query.id), (err, campaign) => {
    if (err || !campaign) return res.redirect('/admin');

    const submitions = [];

    for (let index = 0; index < campaign.submitions.length; index++) {
      if (campaign.submitions[index].version == parseInt(req.query.version)) {
        foundSubmitionNumber++;
        submitions.push(campaign.submitions[index]);

        if (submitions.length >= 30) break;
      }
    }

    async.times(
      submitions.length,
      (time, next) => {
        User.findById(mongoose.Types.ObjectId(submitions[time].user_id), (err, user) => {
          if (err) return next(err);

          return next(null, {
            user,
            answers: submitions[time].answers
          });
        });
      },
      (err, newSubmitions) => {
        if (err) return res.redirect('/admin');

        return res.render('admin/submitions', {
          page: 'admin/submitions',
          title: campaign.name,
          includes: {
            external: ['css', 'admin_general_css', 'fontawesome']
          },
          campaign,
          submitions: newSubmitions,
          version: req.query.version
        });
      }
    );
  });
}
