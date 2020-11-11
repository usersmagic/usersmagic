const cron = require('cron');
const mongoose = require('mongoose');
const validator = require('validator');

const CronJob = cron.CronJob;

const Campaign = require('../../../../models/campaign/Campaign');
const PrivateCampaign = require('../../../../models/private_campaign/PrivateCampaign');
const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !validator.isMongoId(req.query.id))
    return res.redirect('/campaigns/user');
  
  User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
    if (err || !user) return res.redirect('/campaigns/user');
  
    if (!req.query.is_private_campaign) {
      Campaign.findOne({
        $and: [
          { _id: mongoose.Types.ObjectId(req.query.id) },
          { _id: {$nin: user.campaigns} }
        ],
        $or: [
          { gender: "both" },
          { gender: user.gender }
        ],
        max_birth_year: { $gte: user.birth_year },
        min_birth_year: { $lte: user.birth_year },
        countries: user.country,
        paused: false
      }, (err, campaign) => {
        if (err || !campaign) return res.redirect('/campaigns/user');
  
        const campaign_status = user.campaign_status || {};
        const campaign_versions = user.campaign_versions || {};
        const campaign_last_question = user.campaign_last_question || {};
  
        campaign_status[req.query.id] = "saved";
        campaign_versions[req.query.id] = campaign.version_number;
        campaign_last_question[req.query.id] = -1;
    
        User.findByIdAndUpdate(mongoose.Types.ObjectId(req.session.user._id), {
          $push: {
            campaigns: campaign._id.toString()
          },
          $set: {
            campaign_status,
            campaign_versions,
            campaign_last_question
          }
        }, {}, err => {
          if (err) return res.redirect('/campaigns/user');
  
          return res.redirect('/test/user?id=' + campaign._id.toString());
        });
      });
    } else {
      PrivateCampaign.findOneAndUpdate({
        $and: [
          { _id: mongoose.Types.ObjectId(req.query.id) },
          { _id: {$nin: user.campaigns} }
        ],
        $or: [
          { gender: null },
          { gender: user.gender }
        ],
        $or: [
          {cities: user.city},
          {cities: {$size: 0}}
        ],
        max_birth_year: { $gte: user.birth_year },
        min_birth_year: { $lte: user.birth_year },
        country: user.country
      }, {$inc: {
        submition_limit: -1
      }}, {}, (err, campaign) => {
        if (err) console.log(err);
        if (err || !campaign) return res.redirect('/campaigns/user');

        const campaign_status = user.campaign_status || {};
        const campaign_versions = user.campaign_versions || {};
        const campaign_last_question = user.campaign_last_question || {};
  
        campaign_status[req.query.id] = "saved";
        campaign_versions[req.query.id] = 1;
        campaign_last_question[req.query.id] = -1;
    
        User.findByIdAndUpdate(mongoose.Types.ObjectId(req.session.user._id), {
          $push: {
            joined_private_campaigns: campaign._id.toString()
          },
          $pull: {
            private_campaigns: req.query.id
          },
          $set: {
            campaign_status,
            campaign_versions,
            campaign_last_question
          }
        }, {}, err => {
          if (err) return res.redirect('/campaigns/user');

          const currDate = new Date();
          console.log(currDate);
          currDate.setSeconds(currDate.getSeconds() + (campaign.time_limit / 1000));
          console.log(currDate);

          const job = new CronJob(currDate, () => {
            delete campaign_status[req.query.id];
            delete campaign_versions[req.query.id];
            delete campaign_last_question[req.query.id];

            const campaignStatusQuery = "campaign_status." + campaign._id.toString();
            
            User.findOneAndUpdate({$and: [
              {_id: mongoose.Types.ObjectId(req.session.user._id)},
              {joined_private_campaigns: campaign._id.toString()},
              {[campaignStatusQuery]: "saved"}
            ]}, {
              $pull: {
                joined_private_campaigns: campaign._id.toString()
              },
              $push: {
                private_campaigns: req.query.id
              },
              $set: {
                campaign_status,
                campaign_versions,
                campaign_last_question
              }
            }, {}, err => {
              if (err) console.log(err);
              if (!user) return;

              PrivateCampaign.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {$inc: {
                submition_limit: 1
              }}, {}, err => {
                if (err) console.log(err);
              });
            });
          });

          job.start();
  
          return res.redirect('/test/user?id=' + campaign._id.toString() + '&is_private_campaign=true');
        });
      });
    };
  });
}
