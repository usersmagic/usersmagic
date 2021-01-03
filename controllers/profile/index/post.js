const mongoose = require('mongoose');
const validator = require('validator');

const User = require('../../../models/user/User');

const getCityTowns = require('../../../utils/getCityTowns');

module.exports = (req, res) => {
  const cities = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkâri', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop', 'Sivas', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
  ];

  const citiesLowerCase = [
    'adana', 'adıyaman', 'afyonkarahisar', 'ağrı', 'aksaray', 'amasya', 'ankara', 'antalya', 'ardahan', 'artvin', 'aydın', 'balıkesir', 'bartın', 'batman', 'bayburt', 'bilecik', 'bingöl', 'bitlis', 'bolu', 'burdur', 'bursa', 'çanakkale', 'çankırı', 'çorum', 'denizli', 'diyarbakır', 'düzce', 'edirne', 'elazığ', 'erzincan', 'erzurum', 'eskişehir', 'gaziantep', 'giresun', 'gümüşhane', 'hakkâri', 'hatay', 'ığdır', 'ısparta', 'istanbul', 'izmir', 'kahramanmaraş', 'karabük', 'karaman', 'kars', 'kastamonu', 'kayseri', 'kilis', 'kırıkkale', 'kırklareli', 'kırşehir', 'kocaeli', 'konya', 'kütahya', 'malatya', 'manisa', 'mardin', 'mersin', 'muğla', 'muş', 'nevşehir', 'niğde', 'ordu', 'osmaniye', 'rize', 'sakarya', 'samsun', 'şanlıurfa', 'siirt', 'sinop', 'sivas', 'şırnak', 'tekirdağ', 'tokat', 'trabzon', 'tunceli', 'uşak', 'van', 'yalova', 'yozgat', 'zonguldak'
  ];

  if (!req.body.name || !req.body.phone) {
    req.session.error = 'Lütfen gerekli bütün bilgileri girin.'
    return res.redirect('/profile');
  }

  if (!validator.isMobilePhone(req.body.phone.trim())) {
    req.session.error = 'Girdiğiniz telefon numarası geçerli değil.'
    return res.redirect('/profile');
  }

  req.body.city = req.body.city ? req.body.city.charAt(0).toLocaleUpperCase() + req.body.city.slice(1).toLocaleLowerCase() : null;

  if (req.body.city && !cities.includes(req.body.city)) {
    req.session.error = 'Lütfen geçerli bir şehir girin.'
    return res.redirect('/profile');
  }
   
  const towns = req.body.city ? getCityTowns(citiesLowerCase[cities.indexOf(req.body.city)]) : null;
  req.body.town = req.body.town ? req.body.town.charAt(0).toLocaleUpperCase() + req.body.town.slice(1).toLocaleLowerCase() : null;

  if (req.body.town && (!towns || !towns.includes(req.body.town))) {
    req.session.error = 'Lütfen geçerli bir ilçe girin.'
    return res.redirect('/profile');
  }

  User.findByIdAndUpdate(mongoose.Types.ObjectId(req.session.user._id), {$set: {
    name: req.body.name,
    phone: req.body.phone,
    city: req.body.city,
    town: req.body.town
  }}, {new: true}, (err, user) => {
    if (err && err.code == 11000) {
      req.session.error = 'Bu telefon numarası zaten kayıtlı, lütfen başka bir numara deneyin.'
      return res.redirect('/profile');
    }
    if (err || !user) {
      req.session.error = 'Bilinmeyen bir hata oluştu, lütfen daha sonra tekrar deneyin.';
      return res.redirect('/profile');
    }

    req.session.user = user;
    return res.redirect('/profile');
  });
}
