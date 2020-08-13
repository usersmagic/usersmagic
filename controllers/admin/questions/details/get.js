const mongoose = require('mongoose');
const validator = require('validator');

const Question = require('../../../../models/question/Question');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !validator.isMongoId(req.query.id))
    return res.redirect('/admin');

  Question.findById(mongoose.Types.ObjectId(req.query.id), (err, question) => {
    if (err || !question) return res.redirect('/admin');

    return res.render('admin/questions/details', {
      page: 'admin/questions/details',
      title: question.name,
      includes: {
        external: ['css', 'js', 'admin_general_css', 'fontawesome']
      },
      question,
      type_names: {
        short_text: "Kısa Yazılı",
        long_text: "Uzun Yazılı",
        radio: "Tek Seçmeli",
        checked: "Çok Seçmeli",
        range: "Aralık Değerlendirme",
        image: "Resim Yükleme"
      }
    });
  });
}
