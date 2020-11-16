const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../models/campaign/Campaign');
const PrivateCampaign = require('../../../models/private_campaign/PrivateCampaign');
const Submition = require('../../../models/submition/Submition');
const User = require('../../../models/user/User');

const sendMail = require('../../../utils/sendMail');

module.exports = (req, res) => {
  if (!req.query || !req.query.updates || req.query.updates != "submition")
    return res.redirect('/');

  User.findOne({
    email: "ygurlek22@my.uaa.k12.tr"
  }, (err, user) => {
    if (err || !user) return res.redirect('/');

    async.times(
      user.campaigns.length,
      (time, next) => {
        Campaign.findById(mongoose.Types.ObjectId(user.campaigns[time]), (err, campaign) => {
          if (err || !campaign) return next(err);

          const answers = {};

          campaign.questions.forEach(question => {
            answers[question.toString()] = user.information[question.toString()] || "";
          });

          return next(null, {
            user_id: user._id.toString(),
            campaign_id: campaign._id.toString(),
            created_at: (new Date()).getTime(),
            ended_at: (new Date()).getTime(),
            answers,
            status: user.campaign_status[campaign._id.toString()],
            reject_message: user.campaign_errors[campaign._id.toString()],
            last_question: user.campaign_last_question[campaign._id.toString()],
            is_private_campaign: false
          });
        });
      }, (err, submitions) => {
        if (err) return res.redirect('/');

        async.times(
          user.joined_private_campaigns.length,
          (time, next) => {
            PrivateCampaign.findById(mongoose.Types.ObjectId(user.joined_private_campaigns[time]), (err, campaign) => {
              if (err || !campaign) return next(err);

              const answers = {};

              campaign.questions.forEach(question => {
                answers[question._id.toString()] = user.private_campaign_informations[question._id.toString()] || "";
              });
      
              return next(null, {
                user_id: user._id.toString(),
                campaign_id: campaign._id.toString(),
                created_at: (new Date()).getTime(),
                ended_at: (new Date()).getTime(),
                answers,
                status: user.campaign_status[campaign._id.toString()] == "saved" ? "timeout" : user.campaign_status[campaign._id.toString()],
                reject_message: user.campaign_errors[campaign._id.toString()],
                last_question: user.campaign_last_question[campaign._id.toString()],
                is_private_campaign: true
              })
            });
          },
          (err, private_submitions) => {
            if (err) return res.redirect('/');

            const new_submitions = submitions.concat(private_submitions);

            async.times(
              new_submitions.length,
              (time, next) => {
                const newSubmitionData = new_submitions[time];
    
                const newSubmition = new Submition(newSubmitionData);
    
                newSubmition.save((err, submition) => next(err, submition ? submition._id.toString() : null));
              },
              (err, submition_ids) => {
                if (err) return res.redirect('/');
    
                User.findByIdAndUpdate(mongoose.Types.ObjectId(user._id), {$set: {
                  submitions: submition_ids
                }}, {}, err => {
                  if (err) return res.redirect('/');
    
                  return res.redirect('/admin');
                });
              }
            );

          }
        );

      }
    );


  });
}
