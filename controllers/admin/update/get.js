const async = require('async');
const mongoose = require('mongoose');

const User = require('../../../models/user/User');
const Campaign = require('../../../models/campaign/Campaign');

const sendMail = require('../../../utils/sendMail');

module.exports = (req, res) => {
  if (!req.query || !req.query.updates)
    return res.redirect('/');

  User.find({
    completed: true,
    country: "tr"
  }, (err, users) => {
    if (err) return res.json({err});

    sendMail({
      emailList: users.map(user => user.email) ,
    }, 'completeCampaign', err => {
      if (err) return res.json({err});
      res.redirect('/admin');
    });
  });
}
