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
        campaigns: campaigns.map(campaign => {
          return {
            _id: campaign._id,
            version_number: campaign.version_number,
            ended: campaign.ended,
            name: campaign.name,
            photo: campaign.photo,
            description: campaign.description,
            information: campaign.information,
            price: campaign.price,
            questions: campaign.questions,
            countries: campaign.countries,
            gender: campaign.gender,
            min_birth_year: campaign.min_birth_year,
            max_birth_year: campaign.max_birth_year
          }
        }),
        questions,
        type_names
      });
    });
  });
}
