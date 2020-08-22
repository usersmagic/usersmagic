const mongoose = require('mongoose');
const validator = require('validator')

const User = require('../../../models/user/User');
const Campaign = require('../../../models/campaign/Campaign');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !validator.isMongoId(req.query.id))
    return res.redirect('/campaigns');
  
  User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
    if (err || !user) return res.redirect('/campaigns');
  
    Campaign.findOne({
      $and: [
        { _id: mongoose.Types.ObjectId(req.query.id) },
        { _id: {$nin: user.campaigns} }
      ],
      paused: false,
      $or: [
        { gender: "both" },
        { gender: user.gender }
      ],
      max_birth_year: { $gte: user.birth_year },
      min_birth_year: { $lte: user.birth_year },
    }, (err, campaign) => {
      if (err || !campaign) return res.redirect('/campaigns');

      const campaign_status = user.campaign_status || {};
      const campaign_versions = user.campaign_versions || {};

      campaign_status[req.query.id] = "saved";
      campaign_versions[req.query.id] = campaign.version_number;
  
      User.findByIdAndUpdate(mongoose.Types.ObjectId(req.session.user._id), {
        $push: {
          campaigns: campaign._id.toString()
        },
        $set: {
          campaign_status,
          campaign_versions
        }
      }, {}, err => {
        if (err) return res.redirect('/campaigns');

        return res.redirect('/test?id=' + campaign._id.toString());
      });
    });
  });
}
