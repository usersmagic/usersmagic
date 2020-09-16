const mongoose = require('mongoose');
const validator = require('validator');

const Question = require('../../../../models/question/Question');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !validator.isMongoId(req.query.id) || !req.body || !req.body.name || !req.body.description || !req.body.text)
    return res.redirect('/admin');

  Question.findById(mongoose.Types.ObjectId(req.query.id), (err, question) => {
    if (err || !question) return res.redirect('/admin');

    Question.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {$set: {
      name: req.body.name,
      description: req.body.description,
      text: req.body.text,
      answer_length: req.body.answer_length || question.answer_length,
      choices: req.body.choices.split('/').map(each => each.trim()) || question.choices,
      min_value: req.body.min_value || question.min_value,
      max_value: req.body.max_value || question.max_value,
      min_explanation: req.body.min_explanation || question.min_explanation,
      max_explanation: req.body.max_explanation || question.max_explanation,
      other_option: req.body.other_option ? true : false
    }}, {}, err => {
      if (err) return res.redirect('/admin');

      return res.redirect('/admin/questions/details?id=' + req.query.id);
    });
  });
}
