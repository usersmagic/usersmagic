// Finds the User of the submition and increase his/her credit by submition's project's price

const mongoose = require('mongoose');

const Project = require('../../project/Project');
const Target = require('../../target/Target');
const User = require('../../user/User');

module.exports = (submition, callback) => {
  Project.findOneByFields({
    _id: submition.campaign_id
  }, {}, (err, project) => {
    if (err || !project) return callback('project_not_found');

    Target.findById(mongoose.Types.ObjectId(submition.target_id), (err, target) => {
      if (err || !target) return callback('target_not_found');

      User.findById(mongoose.Types.ObjectId(submition.user_id), (err, user) => {
        if (err || !user) return callback('user_not_found');

        User.findByIdAndUpdate(mongoose.Types.ObjectId(submition.user_id), {
          $inc: {
            credit: user.paid_campaigns.includes(submition.campaign_id) ? 0 : target.price
          },
          $push: {
            paid_campaigns: project._id.toString()
          }
        }, err => {
          if (err) return callback(err);
  
          return callback(null);
        });
      });
    });
  });
}
