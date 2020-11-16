const mongoose = require('mongoose');

const Campaign = require('../../../../models/campaign/Campaign');
const User = require('../../../../models/user/User');
const Submition = require('../../../../models/submition/Submition');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)
    return res.redirect('/admin');

  if (!req.body)
    req.body = {};

  if (!req.body.reason || !req.body.reason.length)
    req.body.reason = "Başvurunuz spam olarak değerlendirildi. Eğer bir hata olduğunu düşünüyorsanız hello@usersmagic.com adresinden bize ulaşabilirsiniz.";

  Submition.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {
    $set: {
      status: "unapproved",
      reject_message: req.body.reason,
      ended_at: (new Date()).getTime()
    }
  }, {}, (err, submition) => {
    if (err) return res.redirect('/admin');

    User.findByIdAndUpdate(mongoose.Types.ObjectId(submition.user_id), {$pull: {
      campaigns: submition.campaign_id
    }}, {}, err => {
      if (err) return res.redirect('/admin');

      return res.redirect('/admin/submitions?id=' + submition.campaign_id);
    });
  });
}
