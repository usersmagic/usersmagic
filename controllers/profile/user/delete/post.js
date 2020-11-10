const async = require('async');

const Campaign = require('../../../../models/campaign//Campaign');
const PrivateCampaign = require('../../../../models/private_campaign/PrivateCampaign');
const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.body || !req.body.email || !req.body.password)
    return res.redirect('/user/profile');

  User.findUser(req.body.email.trim(), req.body.password, (err, user) => {
    if (err || !user)
      return res.redirect('/profile/user');

    if (req.session.user._id.toString() != user._id.toString())
      return res.redirect('/profile/user');

    
  });
}
