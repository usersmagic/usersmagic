const mongoose = require('mongoose');

const Campaign = require('../../../../models/campaign/Campaign');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !req.body || !req.body.price || !req.body.name || !req.body.description || !req.body.information || !req.body.countries)
    return res.redirect('/admin');

  const countries = req.body.countries.split(',').map(each => each.toLocaleLowerCase());
  const valid_countries = ["türkiye", "amerika", "ingiltere", "almanya"];

  if (countries.filter(each => !valid_countries.includes(each)).length)
    return res.redirect('/admin');

  if (!req.body.gender)
    req.body.gender = 'both';
  else
    req.body.gender = req.body.gender.toLowerCase().trim()

  if (!req.body.min_birth_year)
    req.body.min_birth_year = 1920;

  if (!req.body.max_birth_year)
    req.body.max_birth_year = 2020;

  Campaign.findById(mongoose.Types.ObjectId(req.query.id), (err, campaign) => {
    if (err) return res.redirect('/admin');

    Campaign.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {$set: {
      name: req.body.name,
      description: req.body.description,
      information: req.body.information,
      price: req.body.price,
      countries,
      gender: req.body.gender,
      min_birth_year: req.body.min_birth_year,
      max_birth_year: req.body.max_birth_year
    }}, {}, err => {
      if (err) return res.redirect('/admin');
  
      return res.redirect('/admin/campaigns');
    });
  });
}
