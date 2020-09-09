const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../../models/campaign/Campaign');
const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !req.body || !req.body.questions)
    return res.redirect('/admin');

  const error_messages = {
    tr: "Kampanya için yeni bir versiyon yayınlandı. Lütfen kampanya sorularını bir daha doldurun ve yeniden gönderin.",
    en: "A new version released for the campaign. Please refill your answers and resubmit the campaign.",
    de: "A new version released for the campaign. Please refill your answers and resubmit the campaign."
  };

  Campaign.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {
    $set: {
      questions: JSON.parse(req.body.questions),
      submitions: []
    },
    $inc: {
      version_number: 1.0
    }
  }, {}, (err, campaign) => {
    if (err) return res.redirect('/admin');

    User.find({
      campaigns: req.query.id
    }, (err, users) => {
      if (err) return res.redirect('/admin');

      async.times(
        users.length,
        (time, next) => {
          if (users[time].campaign_status)
          const new_campaign_errors = users[time].campaign_errors;
          new_campaign_errors[req.query.id] = error_messages[users[time].language];

          User.findByIdAndUpdate(mongoose.Types.ObjectId(users[time]._id), {$set: {
            campaign_errors: new_campaign_errors
          }}, {}, err => next(err) );
        },
        err => {
          if (err) return res.redirect('/admin');

          return res.redirect('/admin/campaigns/details?id=' + req.query.id);
        }
      )
    })
  })
}
