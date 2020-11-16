const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../../models/campaign/Campaign');
const Commercial = require('../../../../models/commercial/Commercial');
const PrivateCampaign = require('../../../../models/private_campaign/PrivateCampaign');
const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
    if (err || !user) return res.redirect('/');

    let all_campaigns = [];

    Campaign.find({$and: [
      {_id: {$nin: user.campaigns}},
      {$or: [
        { gender: "both" },
        { gender: user.gender }
      ]},
      {max_birth_year: { $gte: user.birth_year }},
      {min_birth_year: { $lte: user.birth_year }},
      {countries: user.country},
      {paused: false}
    ]}, (err, campaigns) => {
      if (err) return res.redirect('/');

      all_campaigns = campaigns.filter(each => each && each._id).map(campaign => {
        return {
          _id: campaign._id,
          name: campaign.name,
          photo: campaign.photo,
          description: campaign.description,
          price: campaign.price,
          is_free: campaign.is_free,
          is_private_campaign: false
        }
      });

      PrivateCampaign.find({$and: [
        {user_id_list: user._id.toString()},
        {_id: {$nin: user.campaigns}}
      ]}, (err, campaigns) => {
        if (err) return res.redirect('/');

        all_campaigns = all_campaigns.concat(campaigns.filter(each => each && each._id).map(campaign => {
          return {
            _id: campaign._id,
            name: campaign.name,
            photo: campaign.photo,
            description: campaign.description,
            price: campaign.price,
            is_free: campaign.is_free,
            is_private_campaign: true,
            time_limit: Math.round(campaign.time_limit / 1000 / 60 / 60)
          }
        }));

        if (!user.commercials.length)
          return res.render('campaigns/user/index', {
            page: 'campaigns/user/index',
            title: res.__('Kampanyalar'),
            includes: {
              external: ['css', 'js', 'fontawesome']
            },
            campaigns: all_campaigns,
            code: user._id.toString(),
            currency: user.country == "tr" ? "₺" : (user.country == "us" ? "$" : "€"),
            current_page: "campaigns"
          });

        Commercial.findById(mongoose.Types.ObjectId(user.commercials[0]), (err, commercial) => {
          if (err) return res.redirect('/');

          return res.render('campaigns/user/index', {
            page: 'campaigns/user/index',
            title: res.__('Kampanyalar'),
            includes: {
              external: ['css', 'js', 'fontawesome']
            },
            campaigns: all_campaigns,
            code: user._id.toString(),
            currency: user.country == "tr" ? "₺" : (user.country == "us" ? "$" : "€"),
            current_page: "campaigns",
            commercial: (commercial ? {
              name: commercial.name,
              photo: commercial.photo,
              url: commercial.url
            } : null)
          });
        });
      });
    });
  });
}
