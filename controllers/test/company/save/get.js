const mongoose = require('mongoose');

const PrivateCampaign = require('../../../../models/private_campaign/PrivateCampaign');

const deletePhoto = require('../../../../utils/deletePhoto');

module.exports = (req, res) => {
  if (req.query && req.query.id) {
    PrivateCampaign.findById(mongoose.Types.ObjectId(req.query.id), (err, campaign) => {
      if (err) return res.sendStatus(500);

      if (!req.body)
        return res.sendStatus(500);

      PrivateCampaign.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {$set: {
        name: req.body.name || campaign.name,
        photo: req.body.photo || campaign.photo,
        status: "saved",
        description: req.body.description || campaign.description,
        information: req.body.information || campaign.information,
        price: req.body.price || campaign.price,
        country: req.body.country || campaign.country,
        gender: req.body.gender || campaign.gender
      }})
    })
  } else {
    
  }
}
