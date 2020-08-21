const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../../models/campaign/Campaign');
const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !req.query.version)
    return res.redirect('/admin');

  Campaign.findById(mongoose.Types.ObjectId(req.query.id), (err, campaign) => {
    if (err) return res.redirect('/admin');

    async.times(
      campaign.accepted_submitions.length,
      (time, next) => {
        User.findById(mongoose.Types.ObjectId(campaign.accepted_submitions[time]), (err, user) => {
          if (err) return next(err);

          const user_answer = {};

          campaign.questions.forEach(question => {
            user_answer[question] = user.information[question];
          });

          return next(null, user_answer);
        });
      },
      (err, answers_array) => {
        if (err) return res.redirect('/admin');

        const answer = {};
        
        answers_array.forEach((ans, index) => {
          answer[campaign.accepted_submitions[index]] = ans;
        });

        return res.status(200).json(answer);
      }
    );
  });
}
