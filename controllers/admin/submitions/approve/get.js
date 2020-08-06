const mongoose = require('mongoose');

const User = require('../../../../models/user/User');
const Campaign = require('../../../../models/campaign/Campaign');
const { calendarFormat } = require('moment');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !req.query.user)
    return res.redirect('/admin');

  Campaign.findById(mongoose.Types.ObjectId(req.query.id), (err, campaign) => {
    if (err || !campaign) return res.redirect('/admin');

    const submitions = campaign.submitions.filter(sub => sub.user_id.toString() != req.query.user);

    if (submitions.length == campaign.submitions.length)
      return res.redirect('/admin');

    User.findById(mongoose.Types.ObjectId(req.query.user), (err, user) => {
      if (err || !user) return res.redirect('/admin');

      Campaign.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {
        $set: {
          submitions
        },
        $push: {
          accepted_submitions: user._id.toString()
        }
      }, {}, err => {
        if (err) return res.redirect('/admin');

        const campaigns = user.campaigns.map(cam => {
          if (cam._id.toString() == req.query.id.toString()) {
            return {
              _id: cam._id,
              name: cam.name,
              description: cam.description,
              status: "approved",
              error: null,
              price: cam.price,
              photo: cam.photo,
              questions: cam.questions,
              answers: cam.answers
            };
          } else {
            return cam;
          }
        });

        User.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.user), {
          $set: { campaigns },
          $inc: {
            credit: user.paid_campaigns.includes(req.query.id) ? 0 : campaign.price
          },
          $push: {
            paid_campaigns: req.query.id.toString()
          }
        }, {}, (err, user) => {
          if (err || !user) return res.redirect('/admin');

          return res.redirect('/admin/submitions?id=' + req.query.id);
        });
      });
    });
  });
}
