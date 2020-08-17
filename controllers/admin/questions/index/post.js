const Question = require('../../../../models/question/Question');

module.exports = (req, res) => {
  if (!req.body || !req.body.name || !req.body.description || !req.body.text || !req.body.type) {
    req.session.error = "Lütfen soru ismini, açıklamasını, metnini doldurun ve bir soru tipi seçin.";
    return res.redirect('/admin');
  }

  const newQuestionData = {
    name: req.body.name,
    description: req.body.description,
    text: req.body.text,
    type: req.body.type,
    other_option: req.body.other_option ? true : false
  };

  if ((req.body.type == 'short_text' || req.body.type == 'long_text') && req.body.answer_length) 
    newQuestionData.answer_length = req.body.answer_length;

  if ((req.body.type == 'radio' || req.body.type == 'checked') && req.body.choices) 
    newQuestionData.choices = req.body.choices.split('/').map(each => each.trim().split('.').join('').split('?').join(''));

  if ((req.body.type == 'radio' || req.body.type == 'checked') && !req.body.choices) {
    req.session.error = "Tek/Çok Seçmeli soru tipleri için bir cevap listesi verilmelidir.";
    return res.redirect('/admin');
  }

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
    if (err) {
      req.session.error = "Veri tabanı hatası: " + err;
      return res.redirect('/admin');
    }

    return res.redirect('/admin/questions?page=0&limit=100');
  });
}
