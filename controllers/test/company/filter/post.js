const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Campaign = require('../../../../models/campaign/Campaign');
const User = require('../../../../models/user/User');
const Question = require('../../../../models/question/Question');

module.exports = (req, res) => {
  if (!req.body || !req.body.limit || (parseInt(Number(req.body.limit)) != req.body.limit))
    return res.sendStatus(400);

  const options = [];

  if (req.body.gender && (req.body.gender == "erkek" || req.body.gender == "kadın"))
    options.push({
      gender: req.body.gender
    });

  if (req.body.birth_year && req.body.birth_year.max && req.body.birth_year.max >= 1920)
    options.push({
      birth_year: {$gte: req.body.birth_year.max}
    });
  
  if (req.body.birth_year && req.body.birth_year.min && req.body.birth_year.min <= 2020)
    options.push({
      birth_year: {lte: req.body.birth_year.min}
    });

  if (req.body.country && ["tr", "us", "uk", "de", "ru", "ua"].includes(req.body.country))
    options.push({
      country: req.body.country
    });

  if (req.body.campaigns && req.body.campaigns.filter(each => !validator.isMongoId(each)).length)
    return res.sendStatus(500);

  if (req.body.campaigns)
    options.push({
      $and: req.body.campaigns.map(each => {
        return { campaigns: {$ne: each} }
      })
    });

  if (req.body.information && req.body.information.filter(each => !each || !each._id || !each.value).lenght)
    return res.sendStatus(500);

  if (req.body.information)
    options.push({
      $and: req.body.information.map(each => {
        const key = "information." + each._id;
        return { [key]: each.value };
      })
    });

  User
    .find({$and: options})
    .limit(parseInt(req.body.limit))
    .countDocuments()
    .then(number => {
      res.write(number);
      res.end();
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
}
