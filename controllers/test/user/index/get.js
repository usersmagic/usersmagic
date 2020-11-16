const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Campaign = require('../../../../models/campaign/Campaign');
const PrivateCampaign = require('../../../../models/private_campaign/PrivateCampaign');
const Submition = require('../../../../models/submition/Submition');
const User = require('../../../../models/user/User');
const Question = require('../../../../models/question/Question');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !validator.isMongoId(req.query.id))
    return res.redirect('/campaigns/user');

  Submition.findById(mongoose.Types.ObjectId(req.query.id), (err, submition) => {
    if (err) return res.redirect('/campaigns/user');

    if (submition.user_id != req.session.user._id.toString())
      return res.redirect('/campaigns/user');

    if (submition.is_private_campaign) {
      PrivateCampaign.findOne({$and: [
        {_id: mongoose.Types.ObjectId(submition.campaign_id)},
        {user_id_list: submition.user_id}
      ]}, (err, campaign) => {
        if (err || !campaign) return res.redirect('/campaigns/user');

        return res.render('test/user/index', {
          page: 'test/user/index',
          title: campaign.name,
          includes: {
            external: ['css', 'js', 'fontawesome']
          }, 
          campaign: {
            _id: submition._id.toString(),
            is_private_campaign: true,
            name: campaign.name,
            photo: campaign.photo,
            information: campaign.information,
            price: campaign.price,
            error: submition.reject_message,
            last_question: submition.last_question
          },
          questions: campaign.questions.map(each => {
            const questionWrapper = {};
            questionWrapper.question = each;
            questionWrapper.answer = submition.answers[question._id.toString()] || "";
            return questionWrapper;
          })
        });
      });
    } else {
      Campaign.findById(mongoose.Types.ObjectId(submition.campaign_id), (err, campaign) => {
        if (err) return res.redirect('/campaigns/user');
  
        async.times(
          campaign.questions.length,
          (time, next) => {
            Question.findById(mongoose.Types.ObjectId(campaign.questions[time]), (err, question) => {
              if (err) return next(err);
  
              return next(null, {
                question,
                answer: submition.answers[question._id.toString()] || ""
              });
            });
          },
          (err, questions) => {
            if (err) return res.redirect('/campaigns/user');
    
            return res.render('test/user/index', {
              page: 'test/user/index',
              title: campaign.name,
              includes: {
                external: ['css', 'js', 'fontawesome']
              },
              campaign: {
                _id: submition._id.toString(),
                name: campaign.name,
                photo: campaign.photo,
                information: campaign.information,
                price: campaign.price,
                error: submition.reject_message,
                last_question: submition.last_question
              },
              questions
            });
          }
        );
      });
    }
  });
}
