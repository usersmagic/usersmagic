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
        campaigns: campaigns.map(camp => {
          return {
            _id: camp._id,
            version_number: camp.version_number,
            ended: camp.ended,
            name: camp.name,
            photo: camp.photo,
            description: camp.description,
            information: camp.information,
            price: camp.price,
            questions: camp.questions,
            countries: camp.countries,
            gender: camp.gender,
            min_birth_year: camp.min_birth_year,
            max_birth_year: camp.max_birth_year,
            accepted_submitions: camp.accepted_submitions.length
          }
        }),
        questions,
        type_names
      });
    });
  });
}
