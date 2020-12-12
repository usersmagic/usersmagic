const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../models/campaign/Campaign');
const PrivateCampaign = require('../../../models/private_campaign/PrivateCampaign');
const Submition = require('../../../models/submition/Submition');
const User = require('../../../models/user/User');

module.exports = (req, res) => {
  User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
    if (err || !user) return res.redirect('/campaigns/user');

    Submition
      .find({
        user_id: user._id.toString()
      })
      .sort({
        created_at: -1
      })
      .then(submitions => {
        async.times(
          submitions.length,
          (time, next) => {
            const submition = submitions[time];

            if (submition.is_private_campaign) {
              PrivateCampaign.findById(mongoose.Types.ObjectId(submition.campaign_id), (err, campaign) => {
                if (err || !campaign) return next(err || true);

                return next(null, {
                  _id: submition._id.toString(),
                  is_private_campaign: true,
                  campaign: {
                    name: campaign.name,
                    photo: campaign.photo,
                    description: campaign.description,
                    price: campaign.price,
                    is_free: false
                  },
                  error: submition.reject_message,
                  status: submition.status,
                  last_question: submition.last_question,
                  will_terminate_at: submition.will_terminate_at
                });
              });
            } else {
              Campaign.findById(mongoose.Types.ObjectId(submition.campaign_id), (err, campaign) => {
                if (err || !campaign) return next(err || true);

                return next(null, {
                  _id: submition._id.toString(),
                  is_private_campaign: false,
                  campaign: {
                    name: campaign.name,
                    photo: campaign.photo,
                    description: campaign.description,
                    price: campaign.price,
                    is_free: campaign.is_free
                  },
                  error: submition.reject_message,
                  status: submition.status,
                  last_question: submition.last_question
                });
              });
            }
          },
          (err, submitions) => {
            if (err) return res.redirect('/campaigns/user');
    
            return res.render('history/user/index', {
              page: 'history/user/index',
              title: res.__('Kampanya Geçmişi'),
              includes: {
                external: ['css', 'js', 'fontawesome']
              },
              submitions,
              code: user._id.toString(),
              currency: user.country == "tr" ? "₺" : (user.country == "us" ? "$" : "€"),
              current_page: "history"
            });  
          }
        );
      })
      .catch(err => {
        return res.redirect('/campaigns/user');
      });
  });
}
