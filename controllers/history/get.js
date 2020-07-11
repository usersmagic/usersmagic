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
        Campaign.findById(mongoose.Types.ObjectId(user.campaigns[time]._id), (err, campaign) => {
          if (err) return next(err);

          return next(null, {
            _id: campaign._id,
            name: campaign.name,
            description: campaign.description,
            price: campaign.price,
            photo: campaign.photo,
            questions: campaign.questions,
            error: user.campaigns[time].error,
            status: user.campaigns[time].status,
            answers: user.campaigns[time].answers
          })
        })
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
