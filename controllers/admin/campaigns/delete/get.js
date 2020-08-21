const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../../models/campaign/Campaign');

const deletePhoto = require('../../../../utils/deletePhoto');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)
    return res.redirect('/admin');

  Campaign.findByIdAndDelete(mongoose.Types.ObjectId(req.query.id), (err, campaign) => {
    if (err || !campaign) return res.redirect('/admin');

    deletePhoto(campaign.photo, err => {
      if (err) return res.redirect('/admin');

      return res.redirect('/campaigns');
    });
  });
}
