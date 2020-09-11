const mongoose = require('mongoose');
const validator = require('validator')

const User = require('../../../../models/user/User');
const Campaign = require('../../../../models/campaign/Campaign');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !validator.isMongoId(req.query.id))
    return res.redirect('/campaigns/user');
  
  User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
    if (err || !user) return res.redirect('/campaigns/user');
  
    Campaign.findOne({
      $and: [
        { _id: mongoose.Types.ObjectId(req.query.id) },
        { _id: {$nin: user.campaigns} }
      ],
      $or: [
        { gender: "both" },
        { gender: user.gender }
      ],
      max_birth_year: { $gte: user.birth_year },
      min_birth_year: { $lte: user.birth_year },
      countries: user.country,
      paused: false
    }, (err, campaign) => {
      if (err || !campaign) return res.redirect('/campaigns/user');

      const campaign_status = user.campaign_status || {};
      const campaign_versions = user.campaign_versions || {};
      const campaign_last_question = user.campaign_last_question || {};

      campaign_status[req.query.id] = "saved";
      campaign_versions[req.query.id] = campaign.version_number;
      campaign_last_question[req.query.id] = -1;
  
      User.findByIdAndUpdate(mongoose.Types.ObjectId(req.session.user._id), {
        $push: {
          campaigns: campaign._id.toString()
        },
        $set: {
          campaign_status,
          campaign_versions,
          campaign_last_question
        }
      }, {}, err => {
        if (err) return res.redirect('/campaigns/user');

        return res.redirect('/test/user?id=' + campaign._id.toString());
      });
    });
  });
}
