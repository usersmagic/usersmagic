const Campaign = require('../../../../models/campaign/Campaign');
const Question = require('../../../../models/question/Question');

module.exports = (req, res) => {
  const type_names = {
    short_text: "Kısa Yazılı",
    long_text: "Uzun Yazılı",
    radio: "Tek Seçmeli",
    checked: "Çok Seçmeli",
    range: "Aralık Değerlendirme",
    image: "Resim"
  };

  Question.find({}, (err, questions) => {
    if (err) return res.redirect('/admin');

    Campaign.find({}, (err, campaigns) => {
      if (err) return res.redirect('/admin');
  
      return res.render('admin/campaigns', {
        page: 'admin/campaigns',
        title: 'Kampanyalar',
        includes: {
          external: ['css', 'js', 'admin_general_css', 'fontawesome']
        },
        campaigns,
        questions,
        type_names
      });
    });
  });
}
