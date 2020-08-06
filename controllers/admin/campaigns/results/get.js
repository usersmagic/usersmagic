const mongoose = require('mongoose');

const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)
    return res.redirect('/admin');

  User.find({
    campaign_ids: mongoose.Types.ObjectId(req.query.id)
  }, (err, users) => {
    if (err) return res.redirect('/admin');

    const answers = {};

    users.forEach(user => {
      user.campaigns.forEach(campaign => {
        if (campaign._id.toString() == req.query.id.toString() && (campaign.status == "approved" || campaign.status == "deleted/approved")) {
          answers[user._id.toString()] = {};
          campaign.answers.forEach((answer, i) => {
            if (answer && answers[user._id.toString()])
              answers[user._id.toString()][i] = answer;
          });
        }
      });
    });

    return res.status(200).json(answers);
  });
}
