const async = require('async');
const mongoose = require('mongoose');

const Campaign = require('../../../models/campaign/Campaign');
const User = require('../../../models/user/User');

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
              price: campaigns[time].price
            });

          Campaign.findByIdAndUpdate(mongoose.Types.ObjectId(campaigns[time]._id), {$push: {
            submitions: user._id.toString()
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

          return res.render('campaigns/index', {
            page: 'campaigns/index',
            title: res.__('Kampanyalar'),
            includes: {
              external: ['css', 'js', 'fontawesome']
            },
            campaigns,
            code: user._id.toString()
          });
        }
      );
    });
  });
}
