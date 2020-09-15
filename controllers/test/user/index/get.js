const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Campaign = require('../../../../models/campaign/Campaign');
const User = require('../../../../models/user/User');
const Question = require('../../../../models/question/Question');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !validator.isMongoId(req.query.id))
    return res.redirect('/campaigns/user');

  User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
    if (err || !user) return res.redirect('/campaigns/user');

    Campaign.findOne({ $and: [
      { _id: mongoose.Types.ObjectId(req.query.id) },
      { _id: { $in: user.campaigns } }
    ]}, (err, campaign) => {
      if (err || !campaign) return res.redirect('/campaigns/user');

      async.times(
        campaign.questions.length,
        (time, next) => {
          Question.findById(mongoose.Types.ObjectId(campaign.questions[time]), (err, question) => {
            if (err) return next(err);

            return next(null, {
              question,
              answer: user.information[question._id.toString()] || null
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
              _id: campaign._id,
              name: campaign.name,
              photo: campaign.photo,
              information: campaign.information,
              price: campaign.price,
              error: user.campaign_errors[campaign._id.toString()],
              version: user.campaign_versions[campaign._id.toString()],
              last_question: user.campaign_last_question[campaign._id.toString()]
            },
            questions
          });
        }
      );
    });
  });
}
