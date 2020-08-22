const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Campaign = require('../../../models/campaign/Campaign');
const User = require('../../../models/user/User');
const Question = require('../../../models/question/Question');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !validator.isMongoId(req.query.id))
    return res.redirect('/campaigns');

  User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
    if (err || !user) return res.redirect('/campaigns');

    Campaign.findOne({
      _id: {
        $and: [
          mongoose.Types.ObjectId(req.query.id),
          { $in: user.campaigns }
        ]
      }
    }, (err, campaign) => {
      if (err || !campaign) return res.redirect('/campaigns');

      async.times(
        campaign.questions,
        (time, next) => {
          Question.findById(mongoose.Types.ObjectId(campaign.questions[time]), (err, question) => next(err, {
              question,
              answer: user.information[question._id.toString()] || user.saved_information[question._id.toString()] || null
            })
          );
        },
        (err, questions) => {
          if (err) return res.redirect('/campaigns');

          return res.render('test/index', {
            page: 'test/index',
            title: campaign.name,
            includes: {
              external: ['css', 'js', 'fontawesome']
            },
            campaign,
            questions
          });
        }
      );
    });
  });
}
