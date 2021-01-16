const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../models/campaign/Campaign');
const PrivateCampaign = require('../../../models/private_campaign/PrivateCampaign');
const Submition = require('../../../models/submition/Submition');
const Test = require('../../../models/test/Test');
const User = require('../../../models/user/User');
const Question = require('../../../models/question/Question');

const sendMail = require('../../../utils/sendMail');

module.exports = (req, res) => {
  if (!req.query || !req.query.updates || req.query.updates != "servvis")
    return res.redirect('/admin');

  // User.find({$and: [
  //   {birth_year: {$gte: 1981}},
  //   {birth_year: {$lte: 1996}}
  // ]}, (err, users) => {
  //   if (err) return res.json({ error: err });

  //   console.log(users.map(user => user.email).concat("ygurlek22@my.uaa.k12.tr"));

  //   sendMail({
  //     emailList: users.map(user => user.email).concat("ygurlek22@my.uaa.k12.tr")
  //   }, 'new_campaigns', err => {
  //     if (err) return res.json({ error: err });

  //     return res.json({ success: true });
  //   });
  // });

  Submition.find({$and: [
    {"target_id": "5ffdc24976f8b23144ca4c69"},
    {"status": "waiting"},
    {"user_id": {$ne: "5f00dfbf6c33210016ada5cc"}}
  ],
  }, (err, submitions) => {
    if (err) return res.json({ error: err });

    async.timesSeries(
      submitions.length,
      (time, next) => {
        const submition = submitions[time];

        User.findById(mongoose.Types.ObjectId(submition.user_id), (err, user) => {
          if (err) return next(err);

          return next(null, {
            answers: submition.answers,
            user: {
              _id: user._id,
              name: user.name,
              gender: user.gender,
              birth_year: user.birth_year,
              city: user.city,
              town: user.town
            }
          });
        });
      },
      (err, data) => {
        if (err) return res.json({ error: err});

        return res.json(data);
      }
    );
  });
}
