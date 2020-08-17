const async = require('async');
const mongoose = require('mongoose');

const User = require('../../models/user/User');
const Campaign = require('../../models/campaign/Campaign');

module.exports = (req, res) => {
  User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
    if (err || !user) return res.redirect('/campaigns');

    async.times(
      user.campaigns.length,
      (time, next) => {
        Campaign.findById(mongoose.Types.ObjectId(user.campaigns[time]), (err, campaign) => {
          if (err || !campaign) return res.redirect('/');

          const notKnownInformation = campaign.questions.filter(question => !user.information[question]);

          if (notKnownInformation.length)
            return next(null, {
              _id: campaign._id,
              name: campaign.name,
              photo: campaign.photo,
              description: campaign.description,
              price: campaign.price
            });

          Campaign.findByIdAndUpdate(mongoose.Types.ObjectId(campaign._id), {$push: {
            submitions: user._id.toString()
          }}, {}, err => {
            if (err) return next(err);

            return next();
          });
        });
      },
      (err, campaigns) => {
        if (err) return res.redirect('/');

        return res.render('history/index', {
          page: 'history/index',
          title: 'Kampanya Geçmişi',
          includes: {
            external: ['css', 'js', 'fontawesome']
          },
          campaigns,
          code: user._id.toString()
        });
      }
    );
  });
}
