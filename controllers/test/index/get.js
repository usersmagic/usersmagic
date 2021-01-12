const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../models/campaign/Campaign');
const Project = require('../../../models/project/Project');
const Submition = require('../../../models/submition/Submition');
const Question = require('../../../models/question/Question');

const changeQuestionToOldQuestions = (question) => {
  const newQuestion = {
    _id: question._id,
    text: question.text,
    answer_length: question.answer_length || 1000
  }
  if (question.type == 'yes_no') {
    newQuestion.type = 'radio';
    newQuestion.choices = ['Evet', 'Hayır'];
    newQuestion.other_option = false;
  } else if (question.type == 'multiple_choice') {
    newQuestion.type = (question.subtype == 'single' ? 'radio' : 'checked');
    newQuestion.choices = question.choices;
    newQuestion.other_option = false;
  } else if (question.type == 'opinion_scale') {
    newQuestion.type = 'range';
    newQuestion.min_value = question.range.min;
    newQuestion.max_value = question.range.max;
    newQuestion.min_explanation = question.labels.left;
    newQuestion.max_explanation = question.labels.right;
  } else if (question.type == 'open_answer') {
    newQuestion.type = 'long_text';
  }

  return newQuestion;
}

module.exports = (req, res) => {
  const user = req.session.user;

  Submition.findOneByIdAndUser(req.query ? req.query.id : null, user._id, (err, submition) => {
    if (err) return res.redirect('/history');
    if (submition.status != 'saved') return res.redirect('/history');

    if (submition.is_private_campaign) {
      if (submition.will_terminate_at <= (new Date()).getTime())
        return res.redirect('/history');

      Project.findById(mongoose.Types.ObjectId(submition.campaign_id), (err, project) => {
        if (err || !project) return res.redirect('/history');
  
        return res.render('test/index', {
          page: 'test/index',
          title: project.name,
          includes: {
            external: ['css', 'js', 'fontawesome']
          }, 
          campaign: {
            _id: submition._id.toString(),
            is_private_campaign: true,
            name: project.name,
            photo: project.photo,
            information: project.welcome_screen.details,
            price: project.price,
            error: submition.reject_message,
            last_question: submition.last_question
          },
          questions: project.questions.map(each => {
            const questionWrapper = {};
            questionWrapper.question = changeQuestionToOldQuestions(each);
            questionWrapper.answer = submition.answers[each._id.toString()] || '';
            return questionWrapper;
          })
        });
      });
    } else {
      Campaign.findById(mongoose.Types.ObjectId(submition.campaign_id), (err, campaign) => {
        if (err) return res.redirect('/history');
  
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
            if (err) return res.redirect('/history');
    
            return res.render('test/index', {
              page: 'test/index',
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
