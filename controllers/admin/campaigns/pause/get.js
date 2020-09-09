const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../../models/campaign/Campaign');
const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)
    return res.redirect('/admin');

  const error_messages = {
    tr: "Bu kampanya geçici olarak durduruldu, lütfen kampanya yeniden açıldıktan sonra kayıtlı cevaplarınızı bir daha gönderin. Kampanya açıldığında e-posta ile bilgilendirileceksiniz. Anlayışınız için teşekkürler.",
    en: "This campaign is paused for now, please resubmit your saved answers once the campaign has been restarted. You will be informed by an email when the campaign restarts. Thank you for your understanding.",
    de: "This campaign is paused for now, please resubmit your saved answers once the campaign has been restarted. You will be informed by an email when the campaign restarts. Thank you for your understanding."
  };

  Campaign.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {$set: {
    paused: true,
    submitions: []
  }}, {}, (err, campaign) => {
    if (err) return res.redirect('/admin');

    User.find({
      campaigns: req.query.id,
      _id: { $nin: campaign.accepted_submitions }
    }, (err, users) => {
      if (err) return res.redirect('/admin');

      async.times(
        users.length,
        (time, next) => {
          const campaign_errors = users[time].campaign_errors;
          campaign_errors[req.query.id] = error_messages[users[time].language];
          const campaign_status = users[time].campaign_status;
          campaign_status[req.query.id] = "stopped";

          User.findByIdAndUpdate(mongoose.Types.ObjectId(users[time]._id), {$set: {
            campaign_errors,
            campaign_status
          }}, {}, err => next(err) );
        },
        err => {
          if (err) return res.redirect('/admin');

          return res.redirect('/admin/campaigns');
        }  
      );
    });
  });
}
