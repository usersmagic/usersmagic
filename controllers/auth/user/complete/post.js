const mongoose = require('mongoose');
const validator = require('validator');

const PrivateCampaign = require('../../../../models/private_campaign/PrivateCampaign');
const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.body || !req.body.name || !req.body.phone || !req.body.gender || !req.body.birth_year || !req.body.country) {
    req.session.error = res.__('Lütfen bütün bilgileri girin');
    return res.redirect('/auth/user/complete');
  }

  const valid_countries = ["tr", "us", "uk", "de", "ru", "ua"];

  if (!valid_countries.includes(req.body.country)) {
    req.session.error = res.__('Lütfen yaşadığınız ülkeyi listeden seçin, elle yazmayın');
    return res.redirect('/auth/user/complete');
  }

  if (!validator.isMobilePhone(req.body.phone.trim())) {
    req.session.error = res.__('Lütfen geçerli bir telefon numarası girin');
    return res.redirect('/auth/user/complete');
  }

  if (!validator.isNumeric(req.body.birth_year.trim(), { no_symbols: true })) {
    req.session.error = res.__('Lütfen doğduğunuz yılı girin');
    return res.redirect('/auth/user/complete');
  }

  if (parseInt(req.body.birth_year) < 1920 || parseInt(req.body.birth_year) > 2020) {
    req.session.error = res.__('Lütfen doğduğunuz yılı girin');
    return res.redirect('/auth/user/complete');
  }

  if (!['erkek', 'kadın'].includes(req.body.gender.toLowerCase().trim())) {
    req.session.error = res.__('Lütfen cinsiyetinizi Kadın ya da Erkek olarak belirtin');
    return res.redirect('/auth/user/complete');
  }

  User.findByIdAndUpdate(mongoose.Types.ObjectId(req.session.user._id), {$set: {
    name: req.body.name.trim(),
    phone: req.body.phone.trim(),
    gender: req.body.gender.toLowerCase().trim(),
    birth_year: parseInt(req.body.birth_year.trim()),
    country: req.body.country,
    completed: true
  }}, {new: true}, (err, user) => {
    if (err && err.code == 11000) {
      req.session.error = res.__('Bu telefon numarası zaten kayıtlı, lütfen başka bir numara deneyin');
      return res.redirect('/auth/user/complete');
    }

    if (err || !user) {
      req.session.error = res.__('Bilinmeyen bir hata oluştu, lütfen daha sonra tekrar deneyin');
      return res.redirect('/auth/user/complete');
    }

    req.session.user = user;

    PrivateCampaign.find({$and: [
      {filter: {$size: 0}},
      {$or: [
        {email_list: null},
        {email_list: {$size: 0}}
      ]},
      {country: user.country},
      {$or: [
        {gender: null},
        {gender: user.gender}
      ]},
      {$or: [
        {min_birth_year: null},
        {min_birth_year: {$lte: user.birth_year}}
      ]},
      {$or: [
        {max_birth_year: null},
        {max_birth_year: {$gte: user.birth_year}}
      ]}
    ]}, (err, campaigns) => {
      if (err) return res.redirect('/');
      
      User.findByIdAndUpdate(mongoose.Types.ObjectId(user._id), {$set: {
        private_campaigns: campaigns.length ? campaigns.map(campaign => campaign._id.toString()) : []
      }}, {}, err => {
        if (err) return res.redirect('/');

        return res.redirect('/campaigns/user');
      });
    });
  });
}
