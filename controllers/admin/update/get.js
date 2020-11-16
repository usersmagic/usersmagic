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

    User
    .find({
      completed: true,
      $or: [
        {submitions_updated: false},
        {submitions_updated: {$exists: false}}
      ]
    })
    .limit(10000)
    .then(users => {
      async.times(
        users.length,
        (time, next) => {
          const user = users[time];
          
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
              if (err) return next(err);
      
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
                  if (err) return next(err);
      
                  const new_submitions = submitions.concat(private_submitions);
      
                  async.times(
                    new_submitions.length,
                    (time, next) => {
                      const newSubmitionData = new_submitions[time];
          
                      const newSubmition = new Submition(newSubmitionData);
          
                      newSubmition.save((err, submition) => next(err, submition ? submition._id.toString() : null));
                    },
                    (err, submition_ids) => {
                      if (err) return next(err);
          
                      User.findByIdAndUpdate(mongoose.Types.ObjectId(user._id), {$set: {
                        submitions_updated: true
                      }}, {}, err => {
                        if (err) return next(err);

                        return next(null);
                      });
                    }
                  );
      
                }
              );
      
            }
          );
      
      
        },
        err => {
          if (err) return res.redirect('/')

          return res.redirect('/admin');
        }
      );

    })
    .catch(err => {
      return res.redirect('/')
    })
}
