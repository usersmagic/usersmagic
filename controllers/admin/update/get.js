const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../models/campaign/Campaign');
const PrivateCampaign = require('../../../models/private_campaign/PrivateCampaign');
const User = require('../../../models/user/User');

const sendMail = require('../../../utils/sendMail');

module.exports = (req, res) => {
  if (!req.query || !req.query.updates || req.query.updates != "marketyo")
    return res.redirect('/');

  PrivateCampaign.findById(mongoose.Types.ObjectId("5f930e84c083c0002d0bddd5"), (err, campaign) => {
    if (err) return res.json({error: err});

    const answers_by_age = {
      "25-30": {
        "2": {},
        "9": {},
        "18": {},
        "3": {},
        "4": {},
        "11": {},
        "19": {},
        "20": {},
        "15": {},
        "16": {}
      },
      "30-40": {
        "2": {},
        "9": {},
        "18": {},
        "3": {},
        "4": {},
        "11": {},
        "19": {},
        "20": {},
        "15": {},
        "16": {}
      },
      "40+": {
        "2": {},
        "9": {},
        "18": {},
        "3": {},
        "4": {},
        "11": {},
        "19": {},
        "20": {},
        "15": {},
        "16": {}
      }
    }

    async.times(
      campaign.accepted_submitions.length,
      (time, next) => {
        if (!campaign.accepted_submitions[time].user_id) return next(null);

        User.findById(mongoose.Types.ObjectId(campaign.accepted_submitions[time].user_id), (err, user) => {
          if (err) return next(err);

          let birth_year; 
          const answers = campaign.accepted_submitions[time].answers;

          if (user.birth_year < 1996 && user.birth_year > 1990) {
            birth_year = "25-30";
          } else if (user.birth_year <= 1990 && user.birth_year > 1980) {
            birth_year = "30-40";
          } else if (user.birth_year <= 1980) {
            birth_year = "40+";
          }

          answers_by_age[birth_year]["2"][answers[2]] = answers_by_age[birth_year]["2"][answers[2]] ? answers_by_age[birth_year]["2"][answers[2]]+1 : 1;
          answers_by_age[birth_year]["9"][answers[9]] = answers_by_age[birth_year]["9"][answers[9]] ? answers_by_age[birth_year]["9"][answers[9]]+1 : 1;
          answers_by_age[birth_year]["18"][answers[18]] = answers_by_age[birth_year]["18"][answers[18]] ? answers_by_age[birth_year]["18"][answers[18]]+1 : 1;
          answers_by_age[birth_year]["3"][answers[3]] = answers_by_age[birth_year]["3"][answers[3]] ? answers_by_age[birth_year]["3"][answers[3]]+1 : 1;
          answers_by_age[birth_year]["4"][answers[4]] = answers_by_age[birth_year]["4"][answers[4]] ? answers_by_age[birth_year]["4"][answers[4]]+1 : 1;
          answers_by_age[birth_year]["11"][answers[11]] = answers_by_age[birth_year]["11"][answers[11]] ? answers_by_age[birth_year]["11"][answers[11]]+1 : 1;

          answers[19].split(" ").forEach(word => {
            if (word.trim().length)
              answers_by_age[birth_year]["19"][word.toLocaleLowerCase().trim()] = answers_by_age[birth_year]["19"][word.toLocaleLowerCase().trim()] ? answers_by_age[birth_year]["19"][word.toLocaleLowerCase().trim()]+1 : 1;
          });

          answers[20].split(" ").forEach(word => {
            if (word.trim().length)
              answers_by_age[birth_year]["20"][word.toLocaleLowerCase().trim()] = answers_by_age[birth_year]["20"][word.toLocaleLowerCase().trim()] ? answers_by_age[birth_year]["20"][word.toLocaleLowerCase().trim()]+1 : 1;
          });

          answers[15].split(" ").forEach(word => {
            if (word.trim().length)
              answers_by_age[birth_year]["15"][word.toLocaleLowerCase().trim()] = answers_by_age[birth_year]["15"][word.toLocaleLowerCase().trim()] ? answers_by_age[birth_year]["15"][word.toLocaleLowerCase().trim()]+1 : 1;
          });

          if (Number.isInteger(answers[16].trim()))
            answers_by_age[birth_year]["16"][answers[16].trim()] = answers_by_age[birth_year]["16"][answers[16].trim()] ? answers_by_age[birth_year]["16"][answers[16].trim()]+1 : 1;

          return next(null);
        });
      },
      (err, data) => {
        if (err) return res.json({error: err});

        return res.json({answers: answers_by_age});
      }
    )
  })
}
