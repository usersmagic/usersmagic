const async = require('async');
const mongoose = require('mongoose');

const PrivateCampaign = require('../../../../../models/private_campaign/PrivateCampaign');
const Submition = require('../../../../../models/submition/Submition');
const User = require('../../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)
    return res.redirect('/admin');

  if (!req.query.page)
    req.query.page = 0;

  const page = parseInt(req.query.page);

  if (req.query.by_question) {
    PrivateCampaign.findById(mongoose.Types.ObjectId(req.query.id), (err, campaign) => {
      if (err || !campaign) return res.redirect('/admin');
  
      async.times(
        Math.min(campaign.submitions.length, 50),
        (time, next) => {
          User.findById(mongoose.Types.ObjectId(campaign.submitions[time].user_id), (err, user) => {
            if (!user || !user.name) return next(null);
  
            next(err, {
              user,
              answer: campaign.submitions[time].answers[req.query.by_question]
            });
          });
        },
        (err, newSubmitions) => {
          if (err) return res.redirect('/admin');
  
          return res.render('admin/private_campaigns/submitions', {
            page: 'admin/private_campaigns/submitions',
            title: campaign.name,
            includes: {
              external: ['css', 'admin_general_css', 'fontawesome']
            },
            campaign,
            questions: campaign.questions.map(question => question.text),
            submitions: newSubmitions.filter(each => each && each.user && each.user._id),
            question_number: parseInt(req.query.by_question),
            is_one_question: true,
            version: req.query.version
          });
        }
      );
    });
  } else {
    PrivateCampaign.findById(mongoose.Types.ObjectId(req.query.id), (err, campaign) => {
      if (err) return res.redirect('/admin');

      Submition
        .find({
          campaign_id: req.query.id,
          status: "waiting"
        })
        .sort({ created_at: 1 })
        .limit(100)
        .then(submitions => {
          async.times(
            submitions.length,
            (time, next) => {
              User.findById(mongoose.Types.ObjectId(submitions[time].user_id), (err, user) => {
                if (!user || !user.name) return next(null);
      
                next(err, {
                  user,
                  answers: Object.values(submitions[time].answers)
                })
              });
            },
            (err, newSubmitions) => {
              if (err) return res.redirect('/admin');
      
              return res.render('admin/private_campaigns/submitions', {
                page: 'admin/private_campaigns/submitions',
                title: campaign.name,
                includes: {
                  external: ['css', 'admin_general_css', 'fontawesome']
                },
                campaign: {
                  _id: campaign._id.toString(),
                  name: campaign.name
                },
                questions: campaign.questions.map(question => question.text),
                submitions: newSubmitions.filter(each => each && each.user && each.user._id),
                version: req.query.version
              });
            }
          );
        })
        .catch(err => {
          return res.redirect('/admin');
        });
    });

  //   PrivateCampaign.findById(mongoose.Types.ObjectId(req.query.id), (err, campaign) => {
  //     if (err || !campaign) return res.redirect('/admin');

  //     if (page * 50 > campaign.submitions.length)
  //       return res.redirect('/admin');

  //     if (parseInt(req.query.by_question) >= campaign.questions.length)
  //       return res.redirect('/admin');
  
  //     async.times(
  //       Math.min((campaign.submitions.length - (page * 50)), 50),
  //       (time, next) => {
  //         User.findById(mongoose.Types.ObjectId(campaign.submitions[(page * 50) + time].user_id), (err, user) => {
  //           if (!user || !user.name) return next(null);
  
  //           next(err, {
  //             user,
  //             answers: campaign.submitions[(page * 50) + time].answers
  //           })
  //         });
  //       },
  //       (err, newSubmitions) => {
  //         if (err) return res.redirect('/admin');
  
  //         return res.render('admin/private_campaigns/submitions', {
  //           page: 'admin/private_campaigns/submitions',
  //           title: campaign.name,
  //           includes: {
  //             external: ['css', 'admin_general_css', 'fontawesome']
  //           },
  //           campaign,
  //           questions: campaign.questions.map(question => question.text),
  //           submitions: newSubmitions.filter(each => each && each.user && each.user._id),
  //           version: req.query.version
  //         });
  //       }
  //     );
  //   });
  }
}
