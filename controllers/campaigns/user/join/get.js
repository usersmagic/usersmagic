const cron = require('cron');
const mongoose = require('mongoose');
const validator = require('validator');

const CronJob = cron.CronJob;

const Campaign = require('../../../../models/campaign/Campaign');
const PrivateCampaign = require('../../../../models/private_campaign/PrivateCampaign');
const Submition = require('../../../../models/submition/Submition');
const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !validator.isMongoId(req.query.id))
    return res.redirect('/campaigns/user');
  
  User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
    if (err || !user) return res.redirect('/campaigns/user');
  
    if (req.query.is_private_campaign) {
      PrivateCampaign.findOneAndUpdate({
        user_id_list: user._id.toString(),
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
        if (err || !campaign) return res.redirect('/campaigns/user');

        const currDate = new Date();
        currDate.setSeconds(currDate.getSeconds() + (campaign.time_limit / 1000));

        const newSubmitionData = {
          campaign_id: campaign._id.toString(),
          user_id: user._id.toString(),
          is_private_campaign: true,
          will_terminate_at: currDate.getTime(),
          answers: campaign.questions.map(() => "")
        };

        const newSubmition = new Submition(newSubmitionData);

        newSubmition.save((err, submition) => {
          if (err) return res.redirect('/campaigns/user');

          User.findByIdAndUpdate(mongoose.Types.ObjectId(req.session.user._id), {$push: {
            campaigns: campaign._id.toString()
          }}, {}, err => {
            if (err) return res.redirect('/campaigns/user');

            const job = new CronJob(currDate, () => {
              Submition.findById(mongoose.Types.ObjectId(submition._id), (err, submition) => {
                if (err || submition.status != "saved") return;
  
                Submition.findByIdAndUpdate(mongoose.Types.ObjectId(submition._id), {$set: {
                  status: "timeout"
                }}, {}, err => {
                  if (err) return;
  
                  User.findByIdAndUpdate(mongoose.Types.ObjectId(req.session.user._id), {$pull: {
                    campaigns: campaign._id.toString()
                  }}, {}, err => {
                    if (err) return;
  
                    PrivateCampaign.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {$inc: {
                      submition_limit: 1
                    }}, {}, () => {
                      return;
                    });
                  });
                });
              });
            });
  
            job.start();
    
            return res.redirect('/test/user?id=' + submition._id.toString());
          });
        });
      });
    } else {
      Campaign.findOne({$and: [
        {$and: [
          { _id: mongoose.Types.ObjectId(req.query.id) },
          { _id: {$nin: user.campaigns} }
        ]},
        {$or: [
          { gender: "both" },
          { gender: user.gender }
        ]},
        {max_birth_year: { $gte: user.birth_year }},
        {min_birth_year: { $lte: user.birth_year }},
        {countries: user.country},
        {paused: false}
      ]}, (err, campaign) => {
        if (err || !campaign) return res.redirect('/campaigns/user');

        const newSubmitionData = {
          campaign_id: campaign._id.toString(),
          user_id: user._id.toString(),
          is_private_campaign: false,
          answers: campaign.questions.map(() => "")
        };

        const newSubmition = new Submition(newSubmitionData);

        newSubmition.save((err, submition) => {
          if (err) return res.redirect('/campaigns/user');

          User.findByIdAndUpdate(mongoose.Types.ObjectId(req.session.user._id), {$push: {
            campaigns: campaign._id.toString()
          }}, {}, err => {
            if (err) return res.redirect('/campaigns/user');

            return res.redirect('/test/user?id=' + submition._id.toString());
          });
        });
      });
    };
  });
}
