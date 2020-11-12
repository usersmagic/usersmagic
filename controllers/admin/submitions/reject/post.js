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

  Submition.findById(mongoose.Types.ObjectId(req.query.id), (err, submition) => {
    if (err) return res.redirect('/admin');

    User.findByIdAndUpdate(mongoose.Types.ObjectId(submition.user_id), {
      $set: {
        ["campaign_status." + submition.campaign_id]: "unapproved",
        ["campaign_errors." + submition.campaign_id]: req.body.reason
      }
    }, {}, (err, user) => {
      if (err || !user) return res.redirect('/admin');

      Submition.findByIdAndDelete(mongoose.Types.ObjectId(req.query.id), err => {
        if (err) return res.redirect('/admin');

        return res.redirect('/admin/submitions?id=' + submition.campaign_id + '&version=1');
      });
    });
  });
}
