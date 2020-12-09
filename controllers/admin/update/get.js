const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../models/campaign/Campaign');
const PrivateCampaign = require('../../../models/private_campaign/PrivateCampaign');
const Submition = require('../../../models/submition/Submition');
const User = require('../../../models/user/User');
const Question = require('../../../models/question/Question');

const sendMail = require('../../../utils/sendMail');

module.exports = (req, res) => {
  if (!req.query || !req.query.updates || req.query.updates != "nike")
    return res.redirect('/');

  Campaign.findById(mongoose.Types.ObjectId("5f5910d71f0d730016419119"), (err, campaign) => {
    if (err || !campaign) return res.redirect('/admin');

    async.times(
      campaign.questions.length,
      (time, next) => {
        Question.findById(mongoose.Types.ObjectId(campaign.questions[time]), (err, question) => next(err || !question, question ? question.name : null))
      },
      (err, questions) => {
        if (err) return res.redirect('/admin');

        User
          .find({$and: [
            {"information.5f4f51cfa437ae001612ae4e": {$exists: true}},
            {"information.5f4f936715b56c001686663d": {$exists: true}},
            {"information.5f4f949015b56c0016866640": {$exists: true}},
            {"information.5f4f961715b56c0016866642": {$exists: true}},
            {"information.5f4f9b6e15b56c0016866643": {$exists: true}},
            {"information.5f4f9c9015b56c0016866645": {$exists: true}},
            {"information.5f4f9d2915b56c0016866646": {$exists: true}},
            {"information.5f4f9d7a15b56c0016866647": {$exists: true}},
            {"information.5f4fa0cb15b56c0016866649": {$exists: true}},
            {"information.5f4fa17d15b56c001686664a": {$exists: true}},
            {"information.5f4fa31415b56c001686664b": {$exists: true}},
            {"information.5f4fa38115b56c001686664c": {$exists: true}},
            {"information.5f4fa44315b56c001686664d": {$exists: true}},
            {"information.5f4fa5d315b56c001686664e": {$exists: true}},
            {"information.5f4fa64f15b56c0016866650": {$exists: true}},
            {"information.5f4fa6a815b56c0016866651": {$exists: true}},
            {"information.5f4fa76e15b56c0016866652": {$exists: true}},
            {"information.5f4faa6d15b56c0016866653": {$exists: true}},
            {"information.5f4fab4c15b56c0016866654": {$exists: true}},
            {"information.5f4fb9e015b56c0016866655": {$exists: true}},
            {"information.5f4fba3215b56c0016866656": {$exists: true}},
            {"information.5f4fba8c15b56c0016866657": {$exists: true}},
            {"information.5f74c3442b4e90001c72b747": {$exists: true}},
            {"information.5f74c3442b4e90001c72b747": {$neq: "Lisanslı sporcu değilim"}}
          ]})
          .limit(10)
          .then(users => {
            return res.json({
              users: users.map(user => {
                return {
                  name: user.name,
                  phone: user.phone,
                  email: user.email,
                  gender: user.gender,
                  birth_year: user.birth_year,
                  city: user.city,
                  town: user.town,
                  [questions[0]]: user["information.5f4f51cfa437ae001612ae4e"],
                  [questions[1]]: user["information.5f4f936715b56c001686663d"],
                  [questions[2]]: user["information.5f4f949015b56c0016866640"],
                  [questions[3]]: user["information.5f4f961715b56c0016866642"],
                  [questions[4]]: user["information.5f4f9b6e15b56c0016866643"],
                  [questions[5]]: user["information.5f4f9c9015b56c0016866645"],
                  [questions[6]]: user["information.5f4f9d2915b56c0016866646"],
                  [questions[7]]: user["information.5f4f9d7a15b56c0016866647"],
                  [questions[8]]: user["information.5f4fa0cb15b56c0016866649"],
                  [questions[9]]: user["information.5f4fa17d15b56c001686664a"],
                  [questions[10]]: user["information.5f4fa31415b56c001686664b"],
                  [questions[11]]: user["information.5f4fa38115b56c001686664c"],
                  [questions[12]]: user["information.5f4fa44315b56c001686664d"],
                  [questions[13]]: user["information.5f4fa5d315b56c001686664e"],
                  [questions[14]]: user["information.5f4fa64f15b56c0016866650"],
                  [questions[15]]: user["information.5f4fa6a815b56c0016866651"],
                  [questions[16]]: user["information.5f4fa76e15b56c0016866652"],
                  [questions[17]]: user["information.5f4faa6d15b56c0016866653"],
                  [questions[18]]: user["information.5f4fab4c15b56c0016866654"],
                  [questions[19]]: user["information.5f4fb9e015b56c0016866655"],
                  [questions[20]]: user["information.5f4fba3215b56c0016866656"],
                  [questions[21]]: user["information.5f4fba8c15b56c0016866657"]
                };
              })
            });
          })
          .catch(err => {
            return res.redirect('/admin');
          });
      }
    );
  });
}
