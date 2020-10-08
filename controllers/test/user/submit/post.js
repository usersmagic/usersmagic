const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Campaign = require('../../../../models/campaign/Campaign');
const PrivateCampaign = require('../../../../models/private_campaign/PrivateCampaign');
const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.body.id || !validator.isMongoId(req.body.id))
    return res.sendStatus(400);

  if (!req.body.is_private_campaign) {
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
  } else {
    User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
      if (err) return res.sendStatus(500);

      PrivateCampaign.findOne({$and: [
        {_id: mongoose.Types.ObjectId(req.body.id)},
        {_id: {$in: user.joined_private_campaigns}}
      ]}, (err, campaign) => {
        if (err) return res.sendStatus(500);

        if (user.campaign_status[req.body.id] == "waiting" || user.campaign_status[req.body.id] == "approved")
          return res.sendStatus(500);
        
        async.times(
          campaign.questions.length,
          (time, next) => {
            if (user.private_campaign_informations[campaign.questions[time]._id])
              return next(null, user.private_campaign_informations[campaign.questions[time]._id]);
            return next(true);
          },
          (err, answers) => {
            if (err) return res.sendStatus(500);

            PrivateCampaign.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.id), {
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

              User.findByIdAndUpdate(req.session.user._id, {
                $set: {
                  campaign_status,
                  campaign_last_question
                }
              }, {}, (err, user) => {
                if (err || !user) return res.sendStatus(500);

                res.sendStatus(200);
              });
            });
          }
        );
      });
    });
  }
}
