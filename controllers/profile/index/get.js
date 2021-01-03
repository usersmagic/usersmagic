const mongoose = require('mongoose');

const User = require('../../../models/user/User');

module.exports = (req, res) => {
  let error = null;
  let payment_error = null;
  const city_error = req.session.city_error || null;
  req.session.city_error = null;

  const cities = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkâri', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop', 'Sivas', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
  ];

  if (req.session && req.session.error) {
    error = req.session.error;
    req.session.error = null;
  }

  if (req.session && req.session.payment_error) {
    payment_error = req.session.payment_error;
    req.session.payment_error = null;
  }

  User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
    if (err || !user) return res.redirect('/');

    return res.render('profile/index', {
      page: 'profile/index',
      title: res.__('Profil'),
      includes: {
        external: ['css', 'js', 'fontawesome']
      },
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        birth_year: user.birth_year,
        payment_number: user.payment_number,
        credit: user.credit,
        waiting_credit: user.waiting_credit,
        overall_credit: user.overall_credit,
        city: user.city,
        town: user.town
      },
      error,
      payment_error,
      code: user._id.toString(),
      currency: user.country == "tr" ? "₺" : (user.country == "us" ? "$" : "€"),
      current_page: "profile",
      city_error,
      cities
    });
  });
}
