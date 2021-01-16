const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../models/campaign/Campaign');
const Project = require('../../../models/project/Project');
const Target = require('../../../models/target/Target');
const User = require('../../../models/user/User');

module.exports = (req, res) => {
  User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
    if (err || !user) return res.redirect('/');

    Campaign.findCampaignsForUser(user, (err, campaigns) => {
      if (err) return res.redirect('/');

      Target.findPossibleTargetGroupsForUser(user._id, (err, targets) => {
        if (err) return res.redirect('/');


        async.timesSeries(
          targets.length,
          (time, next) => {
            const target = targets[time];
            
            Project.findOneByFields({_id: target.project_id}, {}, (err, project) => {
              if (err) return next(err);

              return next(null, {
                _id: target._id,
                is_private_campaign: true,
                name: project.name,
                time_limit: target.time_limit,
                description: project.description,
                image: project.image,
                price: target.price
              });
            });
          },
          (err, projects) => {
            if (err) return res.redirect('/');

            console.log("projects: "+projects);
            return res.render('campaigns/index', {
              page: 'campaigns/index',
              title: res.__('Kampanyalar'),
              includes: {
                external: ['css', 'js', 'fontawesome']
              },
              campaigns: campaigns.concat(projects),
              code: user._id.toString(),
              currency: user.country == "tr" ? "₺" : (user.country == "us" ? "$" : "€"),
              current_page: "campaigns"
            });
          }
        );
      });
    });
  });
}
