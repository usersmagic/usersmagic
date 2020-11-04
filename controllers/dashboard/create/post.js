const mongoose = require('mongoose');

const Company = require('../../../models/company/Company');
const PrivateCampaign = require('../../../models/private_campaign/PrivateCampaign');

module.exports = (req, res) => {
  if (!req.body || !req.body.name || !req.body.photo)
    return res.redirect('/dashboard');

  const newCampaignData = {
    creator: req.session.company._id.toString(),
    name: req.body.name,
    photo: req.body.photo
  };

  const newCampaign = new PrivateCampaign(newCampaignData);

  newCampaign.save((err, campaign) => {
    if (err) return res.redirect('/dashboard');

    Company.findByIdAndUpdate(mongoose.Types.ObjectId(req.session.company._id), {
      $push: {
        campaigns: campaign._id.toString()
      },
      $pull: {
        waiting_photos: req.body.photo
      }
    }, {}, err => {
      if (err) return res.redirect('/admin');

      return res.redirect('/test?id=' + campaign._id.toString());
    });
  });
}
