const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../models/campaign/Campaign');
const Project = require('../../models/project/Project');
const Submition = require('../../models/submition/Submition');
const Target = require('../../models/target/Target');
const User = require('../../models/user/User');

module.exports = (req, res) => {
  const user = req.session.user;

  Submition
    .find({
      user_id: mongoose.Types.ObjectId(user._id)
    })
    .sort({
      created_at: -1
    })
    .then(submitions => {
      async.timesSeries(
        submitions.length,
        (time, next) => {
          const submition = submitions[time];

          if (!submition.is_private_campaign) {
            Campaign.findById(mongoose.Types.ObjectId(submition.campaign_id), (err, campaign) => {
              if (err || !campaign) {
                console.log(err);

                Submition.findByIdAndDelete(mongoose.Types.ObjectId(submition._id), err => {
                  if (err) return next(err);

                  User.findByIdAndUpdate(mongoose.Types.ObjectId(user._id), {$pull: {
                    campaigns: campaign._id.toString()
                  }}, {}, err => {
                    if (err) return next(err);

                    return next(null);
                  });
                });
              } else {
                return next(null, {
                  _id: submition._id.toString(),
                  is_private_campaign: false,
                  campaign: {
                    name: campaign.name,
                    image: (campaign.photo ? campaign.photo : campaign.image),
                    description: campaign.description,
                    price: campaign.price,
                    is_free: campaign.is_free
                  },
                  error: submition.reject_message,
                  status: submition.status,
                  last_question: submition.last_question
                });
              }
            });
          } else {
            if (submition.will_terminate_at > (new Date()).getTime() || submition.status != 'saved') {
              Project.findById(mongoose.Types.ObjectId(submition.campaign_id), (err, project) => {
                if (err || !project) {
                  Submition.findByIdAndDelete(mongoose.Types.ObjectId(submition._id), err => next(err));
                } else {
                  return next(null, {
                    _id: submition._id.toString(),
                    is_private_campaign: true,
                    campaign: {
                      name: project.name,
                      image: project.image,
                      description: project.description,
                      price: project.price,
                      is_free: false
                    },
                    error: submition.reject_message,
                    status: submition.status,
                    last_question: submition.last_question,
                    will_terminate_at: submition.will_terminate_at
                  });
                }
              });
            } else {
              Target.leaveTarget(submition.target_id, user._id, () => {
                Submition.findByIdAndDelete(mongoose.Types.ObjectId(submition._id), err => next(err));
              });
            }
          }
        },
        (err, submitions) => {
          if (err) return res.redirect('/campaigns');
    
            return res.render('history/index', {
              page: 'history/index',
              title: res.__('Kampanya Geçmişi'),
              includes: {
                external: ['css', 'js', 'fontawesome']
              },
              submitions: submitions.filter(each => each && each._id),
              code: user._id.toString(),
              currency: user.country == "tr" ? "₺" : (user.country == "us" ? "$" : "€"),
              current_page: "history"
            });  
        }
      );
    })
    .catch(() => {
      return res.redirect('/');
    });
}
