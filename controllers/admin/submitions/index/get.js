const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../../models/campaign/Campaign');
const Question = require('../../../../models/question/Question');
const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !req.query.version)
    return res.redirect('/admin');

  Campaign.findById(mongoose.Types.ObjectId(req.query.id), (err, campaign) => {
    if (err || !campaign) return res.redirect('/admin');

    const submitions = [];

    for (let index = 0; index < campaign.submitions.length; index++)
      if (campaign.submitions[index].version == parseInt(req.query.version)) {
        submitions.push(campaign.submitions[index]);
        if (submitions.length >= 30) break;
      }

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
                user: {
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  phone: user.phone,
                  gender: user.gender,
                  birth_year: user.birth_year,
                  payment_number: user.payment_number,
                  credit: user.credit,
                  waiting_credit: user.waiting_credit,
                  overall_credit: user.overall_credit,
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
}
