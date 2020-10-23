const mongoose = require('mongoose');

const Company = require('../../../../models/company/Company');
const PrivateCampaign = require('../../../../models/private_campaign/PrivateCampaign');

module.exports = (req, res) => {
  if (!req.body || !req.body.name || !req.body.photo || !req.body.description || !req.body.information || !req.body.price || !req.body.country || !req.body.submition_limit || !req.body.questions)
    return res.sendStatus(500);

  const newPrivateCampaignData = {
    creator: req.session.company._id.toString(),
    photo: req.body.photo,
    name: req.body.name,
    description: req.body.description,
    information: req.body.information,
    gender: req.body.gender && req.body.gender != 'both' ? req.body.gender : null,
    min_birth_year: req.body.min_birth_year ? req.body.min_birth_year : null,
    max_birth_year: req.body.max_birth_year ? req.body.max_birth_year : null,
    price: req.body.price,
    country: req.body.country,
    submition_limit: req.body.submition_limit,
    questions: req.body.questions,
    filter: req.body.filter || [],
    email_list: req.body.emailList && req.body.emailList.length ? req.body.emailList.split(' ') : null
  };

  const newPrivateCampaign = new PrivateCampaign(newPrivateCampaignData);

  newPrivateCampaign.save((err, campaign) => {
    if (err) console.log(err);
    if (err || !campaign) return res.sendStatus(500);

    Company.findByIdAndUpdate(mongoose.Types.ObjectId(req.session.company._id), {$push: {
      campaigns: campaign._id.toString()
    }}, {}, err => {
      if (err) return res.sendStatus(500);

      res.write(campaign._id.toString());
      return res.end();
    });
  });
}
