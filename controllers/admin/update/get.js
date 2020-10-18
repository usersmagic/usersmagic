const async = require('async');
const mongoose = require('mongoose');

const User = require('../../../models/user/User');
const Campaign = require('../../../models/campaign/Campaign');

const sendMail = require('../../../utils/sendMail');

module.exports = (req, res) => {
  if (!req.query || !req.query.updates || req.query.updates != "new")
    return res.redirect('/');

  const cities = ["Istanbul", "Bursa", "Ankara"]
  const field1 = "information.5f8628093b0921001cfa8b3d";
  const field2 = "information.5f86285c3b0921001cfa8b3e";

  User.find({$and: [
    {city: {$in: cities}},
    {[field1]: "Evet"},
    {[field2]: "Evet"}
  ]}, (err, users1) => {
    if (err) return res.redirect('/admin');

    User.find({$and: [
      {city: {$in: cities}},
      {[field1]: "Evet"},
      {[field2]: "Hayır"}
    ]}, (err, users2) => {
      if (err) return res.redirect('/admin');
  
      User.find({$and: [
        {city: {$in: cities}},
        {[field1]: "Hayır"},
        {[field2]: "Evet"}
      ]}, (err, users3) => {
        if (err) return res.redirect('/admin');
    
        return res.json({
          "ikisi": users1.map(user => {return {email: user.email, phone: user.phone}}),
          "25-30": users2.map(user => {return {email: user.email, phone: user.phone}}),
          "30-40": users3.map(user => {return {email: user.email, phone: user.phone}}),
        });
      });
    });
  });
}
