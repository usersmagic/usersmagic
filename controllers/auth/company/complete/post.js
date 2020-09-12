const mongoose = require('mongoose');
const validator = require('validator');

const Company = require('../../../../models/company/Company');

module.exports = (req, res) => {
  if (!req.body || !req.body.company_name || !req.body.phone || !req.body.country) {
    req.session.error = res.__('Lütfen bütün bilgileri girin');
    return res.redirect('/auth/company/complete');
  }

  const valid_countries = ["tr", "us", "uk", "de", "ru", "ua"];

  if (!valid_countries.includes(req.body.country)) {
    req.session.error = res.__('Lütfen yaşadığınız ülkeyi listeden seçin, elle yazmayın');
    return res.redirect('/auth/company/complete');
  }

  if (!validator.isMobilePhone(req.body.phone.trim())) {
    req.session.error = res.__('Lütfen geçerli bir telefon numarası girin');
    return res.redirect('/auth/company/complete');
  }

  Company.findByIdAndUpdate(mongoose.Types.ObjectId(req.session.company._id), {$set: {
    company_name: req.body.company_name.trim(),
    phone: req.body.phone.trim(),
    country: req.body.country,
    completed: true
  }}, {new: true}, (err, company) => {
    if (err && err.code == 11000) {
      req.session.error = res.__('Bu telefon numarası zaten kayıtlı, lütfen başka bir numara deneyin');
      return res.redirect('/auth/company/complete');
    }

    if (err || !company) {
      req.session.error = res.__('Bilinmeyen bir hata oluştu, lütfen daha sonra tekrar deneyin');
      return res.redirect('/auth/company/complete');
    }

    req.session.company = company;
    return res.redirect('/campaigns/company');
  });
}
