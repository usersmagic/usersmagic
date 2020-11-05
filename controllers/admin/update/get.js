const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../models/campaign/Campaign');
const PrivateCampaign = require('../../../models/private_campaign/PrivateCampaign');
const User = require('../../../models/user/User');

const sendMail = require('../../../utils/sendMail');

module.exports = (req, res) => {
  if (!req.query || !req.query.updates || req.query.updates != "data")
    return res.redirect('/');

  PrivateCampaign.findById(mongoose.Types.ObjectId("5f899194673ead001c9ed252"), (err, campaign) => {
    if (err) return res.json({error: err});

    async.times(
      campaign.accepted_submitions.length,
      (time, next) => {
        User.findById(mongoose.Types.ObjectId(campaign.accepted_submitions[time].user_id), (err, user) => next(err, {
          "Ad Soyad": user.name,
          "Doğum Yılı": user.birth_year,
          "Cinsiyet": user.gender,
          "Cevaplar": campaign.accepted_submitions[time].answers
        }));
      },
      (err, data) => {
        if (err) return res.json({error: err});

        return res.json({"Kabul Edilen Cevaplar": data});
      }
    )
  })
}
