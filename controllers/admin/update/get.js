const async = require('async');
const mongoose = require('mongoose');

const User = require('../../../models/user/User');
const Campaign = require('../../../models/campaign/Campaign');

const sendMail = require('../../../utils/sendMail');

module.exports = (req, res) => {
  if (!req.query || !req.query.updates || req.query.updates != "new")
    return res.redirect('/');

  User.find({
    completed: true
  }, (err, users) => {
    if (err) return res.redirect('/');

    sendMail({
      emailList: users.map(user => user.email)
    }, "newCampaigns", err => {
      if (err) return res.redirect('/');

      return res.redirect('/admin');
    })
  })
}
