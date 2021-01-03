// Join a campaign/project with the given id on query

const mongoose = require('mongoose');

const Campaign = require('../../../models/campaign/Campaign');
const Project = require('../../../models/project/Project');
const Submition = require('../../../models/submition/Submition');
const Target = require('../../../models/target/Target');
const User = require('../../../models/user/User');

module.exports = (req, res) => {
  User.getUserById(req.session.user._id, (err, user) => {
    if (err) return res.redirect('/campaigns');

    if (req.query.is_private_campaign) { // Check if the id is on Target model
      Target.joinTarget(req.query ? req.query.id : null, user._id, (err, target) => {
        if (err) return res.redirect('/campaigns');

        Project.findById(mongoose.Types.ObjectId(target.project_id), (err, project) => {
          if (err || !project) return res.redirect('/campaigns');

          Submition.createSubmition({
            campaign_id: project._id,
            user_id: user._id,
            target_id: target._id,
            question_number: project.questions ? project.questions.length : null,
            is_private_campaign: false
          }, (err, submition) => {
            if (err) return res.redirect('/campaigns');
  
            return res.redirect('/test?id=' + submition._id.toString());
          });
        });
      });
    } else {
      Campaign.checkIfUserCanJoinCampaign(req.query ? req.query.id : null, user, (err, campaign) => {
        if (err) return res.redirect('/campaigns');

        Submition.createSubmition({
          campaign_id: campaign._id,
          user_id: user._id,
          question_number: campaign.questions.length,
          is_private_campaign: false
        }, (err, submition) => {
          if (err) return res.redirect('/campaigns');

          User.findByIdAndUpdate(mongoose.Types.ObjectId(req.session.user._id), {$push: {
            campaigns: campaign._id.toString()
          }}, {}, err => {
            if (err) return res.redirect('/campaigns');
  
            return res.redirect('/test?id=' + submition._id.toString());
          });
        });
      });
    };
  });
}
