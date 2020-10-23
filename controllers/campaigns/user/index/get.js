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

    Campaign.find({
      _id: {$nin: user.campaigns},
      $or: [
        { gender: "both" },
        { gender: user.gender }
      ],
      max_birth_year: { $gte: user.birth_year },
      min_birth_year: { $lte: user.birth_year },
      countries: user.country,
      paused: false
    }, (err, campaigns) => {
      if (err) return res.redirect('/');
      all_campaigns = campaigns.filter(each => each._id).map(campaign => {
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
        {filter: {$size: 0}},
        {$or: [
          {email_list: null},
          {email_list: {$size: 0}}
        ]},
        {country: user.country},
        {$or: [
          {gender: null},
          {gender: user.gender}
        ]},
        {$or: [
          {min_birth_year: null},
          {min_birth_year: {$lte: user.birth_year}}
        ]},
        {$or: [
          {max_birth_year: null},
          {max_birth_year: {$gte: user.birth_year}}
        ]}
      ]}, (err, campaigns) => {
        if (err) return res.redirect('/');

        all_campaigns = all_campaigns.concat(campaigns.filter(each => each._id).map(campaign => {
          return {
            _id: campaign._id,
            name: campaign.name,
            photo: campaign.photo,
            description: campaign.description,
            price: campaign.price,
            is_free: false,
            is_private_campaign: true,
            time_limit: Math.round(campaign.time_limit / 1000 / 60 / 60)
          }
        }));

        async.times(
          user.private_campaigns.length,
          (time, next) => {
            PrivateCampaign.findOne({
              _id: mongoose.Types.ObjectId(user.private_campaigns[time]),
              submition_limit: {$gt: 0}
            }, (err, campaign) => {
              if (err) return next(err);
              if (!campaign) return next(null);
              return next(null, {
                _id: campaign._id,
                name: campaign.name,
                photo: campaign.photo,
                description: campaign.description,
                price: campaign.price,
                is_free: false,
                is_private_campaign: true,
                time_limit: Math.round(campaign.time_limit / 1000 / 60 / 60)
              });
            });
          },
          (err, campaigns) => {
            if (err) return res.redirect('/');

            all_campaigns = all_campaigns.concat(campaigns.filter(each => each._id));

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
          }
        );
      });
    });
  });
}
