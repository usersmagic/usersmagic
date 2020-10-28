const async = require('async');
const mongoose = require('mongoose');

const User = require('../../../models/user/User');
const Campaign = require('../../../models/campaign/Campaign');

const sendMail = require('../../../utils/sendMail');

module.exports = (req, res) => {
  if (!req.query || !req.query.updates || req.query.updates != "mail")
    return res.redirect('/');

  User.find({
    private_campaigns: "5f97ef351730bc0034bf9eb5"
  }, (err, users) => {
    if (err) return res.redirect('/');

    sendMail({
      emailList: users.map(user => user.email)
    }, 'varanyol', err => {
      if (err) return res.redirect('/');

      return res.redirect('/admin');
    });
  });
}
