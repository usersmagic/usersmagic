const Question = require('../../../../models/question/Question');

module.exports = (req, res) => {
  Question.find({$or :[
    {type: "radio"},
    {type: "checked"},
    // {type: "range"}
  ]}, (err, questions) => {
    if (err) return res.redirect('/');

    return res.render('test/company/index', {
      page: 'test/company/index',
      title: res.__('Yeni Kampanya Yarat'),
      includes: {
        external: ['css', 'js', 'fontawesome']
      },
      current_page: "test",
      questions
    });
  });
}
