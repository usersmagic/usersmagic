const mongoose = require('mongoose');
const validator = require('validator');

const User = require('../../../models/user/User');

module.exports = (req, res) => {
  if (!req.body || !req.body.name || !req.body.phone || !req.body.gender || !req.body.birth_year || !req.body.country || !req.body.phone_code) {
    req.session.error = res.__('Lütfen bütün bilgileri girin');
    return res.redirect('/auth/complete' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));
  }


  if (req.body.gender.toLowerCase() == "male")
    req.body.gender = "erkek";

  if (req.body.gender.toLowerCase() == "female")
    req.body.gender = "kadın";

  const valid_countries = ["tr", "us", "uk", "de", "ru", "ua"];

  if (!valid_countries.includes(req.body.country)) {
    req.session.error = res.__('Lütfen yaşadığınız ülkeyi listeden seçin, elle yazmayın');
    return res.redirect('/auth/complete' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));
  }

  if (!validator.isMobilePhone(req.body.phone.trim())) {
    req.session.error = res.__('Lütfen geçerli bir telefon numarası girin');
    return res.redirect('/auth/complete' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));
  }

  if (!validator.isNumeric(req.body.birth_year.trim(), { no_symbols: true })) {
    req.session.error = res.__('Lütfen doğduğunuz yılı girin');
    return res.redirect('/auth/complete' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));
  }

  if (parseInt(req.body.birth_year) < 1920 || parseInt(req.body.birth_year) > 2020) {
    req.session.error = res.__('Lütfen doğduğunuz yılı girin');
    return res.redirect('/auth/complete' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));
  }

  if (!['erkek', 'kadın'].includes(req.body.gender.toLowerCase().trim())) {
    req.session.error = res.__('Lütfen cinsiyetinizi Kadın ya da Erkek olarak belirtin');
    return res.redirect('/auth/complete' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));
  }

  User.findByIdAndUpdate(mongoose.Types.ObjectId(req.session.user._id), {$set: {
    name: req.body.name.trim(),
    phone: req.body.phone_code.trim() +""+ req.body.phone.trim(),
    gender: req.body.gender.toLowerCase().trim(),
    birth_year: parseInt(req.body.birth_year.trim()),
    country: req.body.country,
    completed: true
  }}, {new: true}, (err, user) => {
    if (err && err.code == 11000) {
      req.session.error = res.__('Bu telefon numarası zaten kayıtlı, lütfen başka bir numara deneyin');
      return res.redirect('/auth/complete');
    }

    if (err || !user) {
      req.session.error = res.__('Bilinmeyen bir hata oluştu, lütfen daha sonra tekrar deneyin');
      return res.redirect('/auth/complete');
    }

    req.session.user = user;

    return res.redirect('/campaigns');
  });
}
