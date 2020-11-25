const async = require('async');
const csv = require('express-csv')
const mongoose = require('mongoose');

const PrivateCampaign = require('../../../../../models/private_campaign/PrivateCampaign');
const Submition = require('../../../../../models/submition/Submition');
const User = require('../../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)  
    return res.redirect('/admin');

  PrivateCampaign.findById(mongoose.Types.ObjectId(req.query.id), (err, campaign) => {
    if (err || !campaign) return res.redirect('/admin');

    Submition
      .find({
        campaign_id: req.query.id,
        status: "waiting"
      })
      .sort({ created_at: 1 })
      .then(submitions => {
        async.times(
          submitions.length,
          (time, next) => {
            User.findById(mongoose.Types.ObjectId(submitions[time].user_id), (err, user) => {
              if (err || !user || !user.phone)
                return next(err || true);

              return next(null, user.phone)
            })
          },
          (err, phone_numbers) => {
            if (err) return res.redirect('/admin');

            let data = "";

            data += 'Name,' + 'Given Name,' + 'Additional Name,' + 'Family Name,' + 'Yomi Name,' + 'Given Name Yomi,' + 'Additional Name Yomi,' + 'Family Name Yomi,' + 'Name Prefix,' + 'Name Suffix,' + 'Initials,' + 'Nickname,' + 'Short Name,' + 'Maiden Name,' + 'Birthday,' + 'Gender,' + 'Location,' + 'Billing Information,' + 'Directory Server,' + 'Mileage,' + 'Occupation,' + 'Hobby,' + 'Sensitivity,' + 'Priority,' + 'Subject,' + 'Notes,' + 'Language,' + 'Photo,' + 'Group Membership,' + 'Phone 1 - Type,' + 'Phone 1 - Value' + '\n';

            phone_numbers.forEach((phone, time) => {
              data += 'user_' + (time + 1) + ' ' + campaign.name + ',';
              data += 'user_' + (time + 1) + ',,';
              data += campaign.name + ',,,,,,,,,,,,,,,,,,,,,,,,,* myContacts,,' + phone + '\n';
            });

            
            return res.status(200).csv([[data]]);
          }
        );
      })
      .catch(err => {
        return res.redirect('/admin');
      });
  });
}
