const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../models/campaign/Campaign');
const PrivateCampaign = require('../../../models/private_campaign/PrivateCampaign');
const User = require('../../../models/user/User');

module.exports = (req, res) => {
  User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
    if (err || !user) return res.redirect('/campaigns/user');

    async.times(
      user.campaigns.length,
      (time, next) => {
        Campaign.findById(mongoose.Types.ObjectId(user.campaigns[time]), (err, campaign) => {
          if (err || !campaign) return next(err);

          return next(null, {
            _id: campaign._id,
            name: campaign.name,
            photo: campaign.photo,
            description: campaign.description,
            information: campaign.information,
            price: campaign.price,
            is_free: campaign.is_free,
            version: user.campaign_versions[campaign._id.toString()],
            error: user.campaign_errors[campaign._id.toString()] || null,
            status: user.campaign_status[campaign._id.toString()],
            last_question: user.campaign_last_question[campaign._id.toString()]
          });
        });
      },
      (err, campaigns) => {
        if (err) return res.redirect('/');

        async.times(
          user.joined_private_campaigns.length,
          (time, next) => {
            PrivateCampaign.findById(mongoose.Types.ObjectId(user.joined_private_campaigns[time]), (err, campaign) => next(err, {
              _id: campaign._id,
              is_private_campaign: true,
              name: campaign.name,
              photo: campaign.photo,
              description: campaign.description,
              information: campaign.information,
              price: campaign.price,
              is_free: campaign.is_free,
              version: user.campaign_versions[campaign._id.toString()],
              error: user.campaign_errors[campaign._id.toString()] || null,
              status: user.campaign_status[campaign._id.toString()],
              last_question: user.campaign_last_question[campaign._id.toString()],
              time_limit: Math.round(campaign.time_limit / 1000 / 60 / 60)
            }));
          },
          (err, private_campaigns) => {
            if (err) return res.redirect('/campaigns/user');
            
            return res.render('history/user/index', {
              page: 'history/user/index',
              title: res.__('Kampanya Geçmişi'),
              includes: {
                external: ['css', 'js', 'fontawesome']
              },
              campaigns: campaigns.concat(private_campaigns),
              code: user._id.toString(),
              currency: user.country == "tr" ? "₺" : (user.country == "us" ? "$" : "€"),
              current_page: "history"
            });  
          }
        );
      }
    );
  });
}
