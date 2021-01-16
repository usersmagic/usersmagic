const async = require('async');
const mongoose = require('mongoose');

const PrivateCampaign = require('../../../../models/private_campaign/PrivateCampaign');
const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)
    return res.redirect('/admin');

  PrivateCampaign.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {$set: {
    status: "approved",
    reject_message: null
  }}, {}, (err, campaign) => {
    if (err) return res.redirect('/admin');

    const filters = [];

    filters.push({private_campaigns: {$ne: campaign._id.toString()}});

    if (campaign.gender)
      filters.push({gender: campaign.gender});

    if (campaign.min_birth_year)
      filters.push({birth_year: {$gte: campaign.min_birth_year}});

    if (campaign.max_birth_year)
      filters.push({birth_year: {$lte: campaign.max_birth_year}});

    if (campaign.country)
      filters.push({country: campaign.country});

    if (campaign.cities)
      filters.push({city: campaign.cities});

    if (campaign.email_list && campaign.email_list.length)
      filters.push({email: {$in: campaign.email_list}});

    campaign.filter.forEach(filter => {
      const newFilter = {};
      if (filter.or) {
        newFilter.$or = [];
        filter.or.forEach(subfilter => {
          const newSubfilter = {};
          newSubfilter["information." + Object.keys(subfilter)[0]] = Object.values(subfilter)[0]
          newFilter.$or.push(newSubfilter);
        });
      } else if (filter.and) {
        newFilter.$and = [];
        filter.and.forEach(subfilter => {
          const newSubfilter = {};
          newSubfilter["information." + Object.keys(subfilter)[0]] = Object.values(subfilter)[0]
          newFilter.$and.push(newSubfilter);
        });
      }
      filters.push(newFilter);
    });

    User.find({$and: filters}, (err, users) => {
      if (err) return res.redirect('/admin');

      PrivateCampaign.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {$set: {
        user_id_list: users.map(user => user._id.toString())
      }}, {}, err => {
        if (err) return res.redirect('/admin');

        return res.redirect('/admin/private_campaigns');
      });
    });
  });
}
