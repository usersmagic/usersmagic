const async = require('async');
const mongoose = require('mongoose');

const User = require('../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.updates)
    return res.redirect('/');

  User.find({
    completed: true
  }, (err, users) => {
    if (err) return res.redirect('/');

    async.times(
      users.length,
      (time, next) => {
        User.findByIdAndUpdate(mongoose.Types.ObjectId(users[time]._id), {$set: {
          country: "tr",
          campaigns: [],
          paid_campaigns: [],
          campaign_errors: {},
          campaign_versions: {},
          campaign_last_question: {},
          campaign_status: {},
          information: {}
        }}, {new: false}, (err, user) => {
          if (err) return next(err);

          const information = user.information;
          user.campaigns.forEach(campaign => {
            if (campaign._id && campaign.status == "approved" && campaign.answers[0].length) {
              if (campaign._id.toString() == "5f21fb7e26b85a0016eb60b4") {
                information["5f4f51cfa437ae001612ae4e"] = campaign.answers[0];
                information["5f4f936715b56c001686663d"] = campaign.answers[5];
              } else if (campaign._id.toString() == "5f25d2b8076cb100168981cc") {
                information["5f4f949015b56c0016866640"] = campaign.answers[0].trim() == "Diğer" ? campaign.answers[1] : campaign.answers[0];
                information["5f4f961715b56c0016866642"] = campaign.answers[3];
                information["5f4f9b6e15b56c0016866643"] = campaign.answers[5];
                information["5f4f9c9015b56c0016866645"] = campaign.answers[6];
                information["5f4f9d2915b56c0016866646"] = campaign.answers[7];
                information["5f4f9d7a15b56c0016866647"] = campaign.answers[8];
              } else if (campaign._id.toString() == "5f03393d8a959e00166d0ddb") {
                information["5f4fa0cb15b56c0016866649"] = campaign.answers[0].filter(ans => ans.trim() == "Diğer").length ? campaign.answers[0].push(campaign.answers[1]) : campaign.answers[0];
                information["5f4fa17d15b56c001686664a"] = campaign.answers[2].filter(ans => ans.trim() == "Diğer").length ? campaign.answers[2].push(campaign.answers[3]) : campaign.answers[2];
                information["5f4fa31415b56c001686664b"] = campaign.answers[4];
                information["5f4fa38115b56c001686664c"] = campaign.answers[5].trim() == "Diğer" ? campaign.answers[6] : campaign.answers[5];
                information["5f4fa44315b56c001686664d"] = campaign.answers[7].filter(ans => ans.trim() == "Diğer").length ? campaign.answers[7].push(campaign.answers[8]) : campaign.answers[7];
                information["5f4fa5d315b56c001686664e"] = campaign.answers[9];
                information["5f4fa64f15b56c0016866650"] = campaign.answers[13].filter(ans => ans.trim() == "Diğer").length ? campaign.answers[13].push(campaign.answers[14]) : campaign.answers[13];
                information["5f4fa6a815b56c0016866651"] = campaign.answers[15].filter(ans => ans.trim() == "Diğer").length ? campaign.answers[15].push(campaign.answers[16]) : campaign.answers[15];
                information["5f4fa76e15b56c0016866652"] = campaign.answers[17].filter(ans => ans.trim() == "Diğer").length ? campaign.answers[17].push(campaign.answers[18]) : campaign.answers[17];
              } else if (campaign._id.toString() == "5f033d588a959e00166d0ddd") {
                information["5f4faa6d15b56c0016866653"] = campaign.answers[0].filter(ans => ans.trim() == "Diğer").length ? campaign.answers[0].push(campaign.answers[1]) : campaign.answers[0];
                information["5f4fab4c15b56c0016866654"] = campaign.answers[2];
                information["5f4fb9e015b56c0016866655"] = campaign.answers[3];
                information["5f4fba3215b56c0016866656"] = campaign.answers[4].filter(ans => ans.trim() == "Diğer").length ? campaign.answers[4].push(campaign.answers[5]) : campaign.answers[4];
                information["5f4fba8c15b56c0016866657"] = campaign.answers[6].filter(ans => ans.trim() == "Diğer").length ? campaign.answers[6].push(campaign.answers[7]) : campaign.answers[6];
              }
            }
          });

          User.findByIdAndUpdate(mongoose.Types.ObjectId(user._id), {$set: {
            information
          }}, {}, err => {
            return next(err);
          })
        });
      },
      err => {
        if (err) return res.redirect('/');

        return res.redirect('/admin');
      }
    );
  });
}
