const async = require('async');
const mongoose = require('mongoose');

const PrivateCampaign = require('../../../../models/private_campaign/PrivateCampaign');
const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !req.body || (!req.body.approve && !req.body.reject_message))
    return res.redirect('/admin');

  PrivateCampaign.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {$set: {
    status: (req.body.approve ? "approved" : "unapproved"),
    reject_message: req.body.reject_message
  }}, {}, (err, campaign) => {
    if (err) return res.redirect('/admin');

    if (!req.body.approve)
      return res.redirect('/admin/privatecampaigns');

    const filters = [];

    if (campaign.gender)
      filters.push({gender: campaign.gender});

    if (campaign.min_birth_year)
      filters.push({birth_year: {$gte: campaign.min_birth_year}});

    if (campaign.max_birth_year)
      filters.push({birth_year: {$lte: campaign.max_birth_year}});

    if (campaign.country)
      filters.push({country: campaign.country});

    (Object.keys(campaign.filter)).forEach((key, index) => {
      const key = "information." + key;
      filters.push({[key]: (Object.values(campaign.filter))[index]});
    });

    User.find({$and: filters}, (err, users) => {
      if (err) return res.redirect('/admin');

      async.times(
        users.length,
        (time, next) => {
          User.findByIdAndUpdate(mongoose.Types.ObjectId(users[time]._id), {$push: {
            private_campaigns: campaign._id.toString()
          }}, {}, err => next(err))
        },
        err => {
          if (err) return res.redirect('/admin');

          return res.redirect('/admin/private_campaigns');
        }
      )
    })
  })
}
