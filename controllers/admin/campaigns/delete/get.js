const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../../models/campaign/Campaign');
const User = require('../../../../models/user/User');

const deletePhoto = require('../../../../utils/deletePhoto');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)
    return res.redirect('/admin');

  Campaign.findByIdAndDelete(mongoose.Types.ObjectId(req.query.id), (err, campaign) => {
    if (err || !campaign) return res.redirect('/admin');

    deletePhoto(campaign.photo, err => {
      if (err) return res.redirect('/admin');

      User.find({$or: [
        { campaigns: req.query.id },
        { paid_campaigns: req.query.id }
      ]}, (err, users) => {
        if (err) return res.redirect('/admin');

        async.times(
          users.length,
          (time, next) => {
            const campaign_status = users[time].campaign_status;
            const campaign_versions = users[time].campaign_versions;
            const campaign_last_question = users[time].campaign_last_question;
            const campaign_errors = users[time].campaign_errors;

            delete campaign_status[req.query.id];
            delete campaign_versions[req.query.id];
            delete campaign_last_question[req.query.id];
            delete campaign_errors[req.query.id];

            User.findByIdAndUpdate(mongoose.Types.ObjectId(users[time]._id), {
              $pull: {
                campaigns: req.query.id,
                paid_campaigns: req.query.id
              },
              $set: {
                campaign_status,
                campaign_versions,
                campaign_last_question,
                campaign_errors
              }
            }, {}, err => next(err));
          },
          err => {
            if (err) return res.redirect('/admin');

            return res.redirect('/admin/campaigns');
          }
        );
      });
    });
  });
}
