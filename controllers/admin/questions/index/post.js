const Question = require('../../../../models/question/Question');

module.exports = (req, res) => {
  if (!req.body || !req.body.name || !req.body.description || !req.body.text || !req.body.type)
    return res.redirect('/admin');

  const newQuestionData = {
    name: req.body.name,
    description: req.body.description,
    text: req.body.text,
    type: req.body.type
  };

  if ((req.body.type == 'short_text' || req.body.type == 'long_text') && req.body.answer_length) 
    newQuestionData.answer_length = req.body.answer_length;

  if ((req.body.type == 'radio' || req.body.type == 'checked') && req.body.choices) 
    newQuestionData.answer_length = req.body.choices;

  if ((req.body.type == 'radio' || req.body.type == 'checked') && !req.body.choices)
    return res.redirect('/admin');

  if (req.body.type == "range" && req.body.min_value)
    newQuestionData.min_value = parseInt(req.body.min_value);
  
  if (req.body.type == "range" && req.body.max_value)
    newQuestionData.max_value = parseInt(req.body.max_value);
  
  if (req.body.type == "range" && req.body.min_explanation)
    newQuestionData.min_explanation = req.body.min_explanation;
  
  if (req.body.type == "range" && req.body.max_explanation)
    newQuestionData.max_explanation = req.body.max_explanation;
  
  const newQuestion = new Question(newQuestionData);

  newQuestion.save((err, question) => {
    if (err) return res.redirect('/admin');

    return res.redirect('/admin/questions?page=0&limit=100');
  });
}
