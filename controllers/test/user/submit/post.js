const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const User = require('../../../../models/user/User');
const Campaign = require('../../../../models/campaign/Campaign');

module.exports = (req, res) => {
  if (!req.query || !req.body.id || !validator.isMongoId(req.body.id))
    return res.sendStatus(400);

  Campaign.findById(mongoose.Types.ObjectId(req.body.id), (err, campaign) => {
    if (err || !campaign) return res.sendStatus(500);
  
    User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
      if (err || !user) return res.sendStatus(500);

      if (user.campaign_status[req.body.id] == "waiting" || user.campaign_status[req.body.id] == "approved")
        return res.sendStatus(500);
        
      async.times(
        campaign.questions.length,
        (time, next) => {
          if (user.information[campaign.questions[time]])
            return next(null, user.information[campaign.questions[time]]);
          return next(true);
        },
        (err, answers) => {
          if (err) return res.sendStatus(500);

          Campaign.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.id), {
            $push: {
              submitions: {
                user_id: user._id.toString(),
                version: user.campaign_versions[campaign._id.toString()],
                answers
              }
            }
          }, {}, (err, campaign) => {
            if (err || !campaign) return res.sendStatus(500);

            const campaign_status = user.campaign_status;
            campaign_status[req.body.id] = "waiting";

            const campaign_last_question = user.campaign_last_question;
            campaign_last_question[req.body.id] = -1;

            User.findByIdAndUpdate(req.session.user._id, {$set: {
              campaign_status,
              campaign_last_question
            }}, {}, (err, user) => {
              if (err || !user) return res.sendStatus(500);

              res.sendStatus(200);
            });
          });
        }
      );
    });
  });
}
