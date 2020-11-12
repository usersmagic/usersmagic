const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../../models/campaign//Campaign');
const PrivateCampaign = require('../../../../models/private_campaign/PrivateCampaign');
const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.body || !req.body.email || !req.body.password)
    return res.sendStatus(400);

  User.findUser(req.body.email.trim(), req.body.password, (err, user) => {
    if (err || !user)
      return res.sendStatus(400);

    if (req.session.user._id.toString() != user._id.toString())
      return res.sendStatus(400);

    async.times(
      user.campaigns.length,
      (time, next) => {
        Campaign.findByIdAndUpdate(mongoose.Types.ObjectId(user.campaigns[time]), {$pull: {
          submitions: {user_id: user._id.toString()}
        }})
      },
      err => {
        if (err) return res.sendStatus(500);

        PrivateCampaign.find({
          "submitions.user_id": user._id.toString()
        })
      }
    );
  });
}
