const Campaign = require('../../../../models/campaign/Campaign');

const uploadPhoto = require('../../../../utils/uploadPhoto');

module.exports = (req, res) => {
  if (!req.file || !req.file.filename || !req.body || (!req.body.price && !req.body.is_free) || !req.body.name || !req.body.description || !req.body.information || !req.body.countries || !req.body.questions)
    return res.redirect('/admin');

  if (!req.body.gender)
    req.body.gender = 'both';
  else
    req.body.gender = req.body.gender.toLowerCase().trim();

  const countries = req.body.countries.split(',').map(each => each.trim().toLocaleLowerCase());
  const valid_countries = ["tr", "us", "uk", "de", "ru", "ua"];

  if (countries.filter(each => !valid_countries.includes(each)).length)
    return res.redirect('/admin');

  if (!req.body.min_birth_year)
    req.body.min_birth_year = 1920;

  if (!req.body.max_birth_year)
    req.body.max_birth_year = 2020;

  uploadPhoto(req.file.filename, req.file.size, (err, location) => {
    if (err) return res.redirect('/admin');

    const newCampaignData = {
      name: req.body.name,
      description: req.body.description,
      information: req.body.information,
      price: req.body.is_free ? 0 : req.body.price,
      is_free: req.body.is_free ? true : false,
      photo: location,
      countries,
      gender: req.body.gender,
      min_birth_year: req.body.min_birth_year,
      max_birth_year: req.body.max_birth_year,
      questions: JSON.parse(req.body.questions)
    };

    const newCampaign = new Campaign(newCampaignData);

    newCampaign.save(err => {
      if (err) return res.redirect('/admin');

      return res.redirect('/admin/campaigns');
    });
  });
}
