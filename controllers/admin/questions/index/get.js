const validator = require('validator');

const Question = require('../../../../models/question/Question');

module.exports = (req, res) => {
  if (!req.query || !req.query.page || !validator.isNumeric(req.query.page, { no_symbols: true }) || !req.query.limit || !validator.isNumeric(req.query.limit, { no_symbols: true }))
    return res.redirect('/admin/questions?page=0&limit=100');

  const type_names = {
    short_text: "Kısa Yazılı",
    long_text: "Uzun Yazılı",
    radio: "Tek Seçmeli",
    checked: "Çok Seçmeli",
    range: "Aralık Değerlendirme",
    image: "Resim"
  };

  if (req.query.search)
    Question
      .find({
        name: { $regex: req.query.search, $options: 'i' }
      })
      .skip(parseInt(req.query.page) * parseInt(req.query.limit))
      .limit(parseInt(req.query.limit))
      .then(questions => {
        return res.render('admin/questions', {
          page: 'admin/questions',
          title: 'Sorular',
          includes: {
            external: ['css', 'js', 'admin_general_css', 'fontawesome']
          },
          questions,
          type_names
        });
      })
      .catch(err => {
        console.log(err);
        return res.redirect('/admin');
      });
  else
    Question
      .find({})
      .skip(parseInt(req.query.page) * parseInt(req.query.limit))
      .limit(parseInt(req.query.limit))
      .then(questions => {
        return res.render('admin/questions', {
          page: 'admin/questions',
          title: 'Sorular',
          includes: {
            external: ['css', 'js', 'admin_general_css', 'fontawesome']
          },
          questions,
          type_names
        });
      })
      .catch(err => {
        console.log(err);
        return res.redirect('/admin');
      });
}
