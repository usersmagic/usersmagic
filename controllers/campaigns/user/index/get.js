const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../../models/campaign/Campaign');
const Commercial = require('../../../../models/commercial/Commercial');
const PrivateCampaign = require('../../../../models/private_campaign/PrivateCampaign');
const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
    if (err || !user) return res.redirect('/');

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

      async.times(
        campaigns.length,
        (time, next) => {
          const notKnownInformation = campaigns[time].questions.filter(question => !user.information[question]);

          if (notKnownInformation.length)
            return next(null, {
              _id: campaigns[time]._id,
              name: campaigns[time].name,
              photo: campaigns[time].photo,
              description: campaigns[time].description,
              price: campaigns[time].price,
              is_free: campaigns[time].is_free
            });

          Campaign.findByIdAndUpdate(mongoose.Types.ObjectId(campaigns[time]._id), {$push: {
            accepted_submitions: user._id.toString()
          }}, {}, err => {
            if (err) return next(err);

            User.findByIdAndUpdate(mongoose.Types.ObjectId(req.session.user._id), {$push: {
              campaigns: campaigns[time]._id.toString()
            }}, {}, err => {
              if (err) return next(err);

              return next();
            });
          });
        },
        (err, campaigns) => {
          if (err) return res.redirect('/');

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
            (err, private_campaigns) => {
              if (err) return res.redirect('/');

              if (!user.commercials.length)
                return res.render('campaigns/user/index', {
                  page: 'campaigns/user/index',
                  title: res.__('Kampanyalar'),
                  includes: {
                    external: ['css', 'js', 'fontawesome']
                  },
                  campaigns: campaigns.filter(campaign => campaign && campaign._id).concat(private_campaigns.filter(campaign => campaign && campaign._id)),
                  code: user._id.toString(),
                  currency: user.country == "tr" ? "₺" : (user.country == "us" ? "$" : "€"),
                  current_page: "campaigns"
                });

              Commercial.findById(mongoose.Types.ObjectId(user.commercials[user.commercials.length-1]), (err, commercial) => {
                if (err) return res.redirect('/');

                return res.render('campaigns/user/index', {
                  page: 'campaigns/user/index',
                  title: res.__('Kampanyalar'),
                  includes: {
                    external: ['css', 'js', 'fontawesome']
                  },
                  campaigns: campaigns.filter(campaign => campaign && campaign._id).concat(private_campaigns.filter(campaign => campaign && campaign._id)),
                  code: user._id.toString(),
                  currency: user.country == "tr" ? "₺" : (user.country == "us" ? "$" : "€"),
                  current_page: "campaigns",
                  commercial: commercial ? {
                    name: commercial.name,
                    photo: commercial.photo,
                    url: commercial.url
                  } : null
                });
              });
            }
          );
        }
      );
    });
  });
}
