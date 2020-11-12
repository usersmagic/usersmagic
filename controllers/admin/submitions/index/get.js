const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../../models/campaign/Campaign');
const Question = require('../../../../models/question/Question');
const User = require('../../../../models/user/User');
const Submition = require('../../../../models/submition/Submition');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !req.query.version)
    return res.redirect('/admin');

  Submition
    .find({ campaign_id: req.query.id })
    .limit(100)
    .sort({ created_at: 1 })
    .then(submitions => {
      Campaign.findById(mongoose.Types.ObjectId(req.query.id), (err, campaign) => {
        if (err || !campaign) return res.redirect('/admin');
    
        async.times(
          campaign.questions.length,
          (time, next) => {
            Question.findById(mongoose.Types.ObjectId(campaign.questions[time]), (err, question) => next(err, question.text));
          },
          (err, questions) => {
            if (err) return res.redirect('/admin');
    
            async.times(
              submitions.length,
              (time, next) => {
                User.findById(mongoose.Types.ObjectId(submitions[time].user_id), (err, user) => {
                  if (!user || !user.name) return next(null);
        
                  next(err, {
                    _id: submitions[time]._id.toString(),
                    user: {
                      _id: user._id,
                      name: user.name,
                      email: user.email,
                      phone: user.phone,
                      gender: user.gender,
                      birth_year: user.birth_year,
                      city: user.city,
                      town: user.town
                    },
                    answers: submitions[time].answers
                  })
                });
              },
              (err, newSubmitions) => {
                if (err) return res.redirect('/admin');
        
                return res.render('admin/submitions', {
                  page: 'admin/submitions',
                  title: campaign.name,
                  includes: {
                    external: ['css', 'admin_general_css', 'fontawesome']
                  },
                  campaign,
                  questions,
                  submitions: newSubmitions.filter(each => each && each.user && each.user._id),
                  version: req.query.version
                });
              }
            );
          }
        );
      });
    })
    .catch(err => {
      return res.redirect('/admin');
    });
}
