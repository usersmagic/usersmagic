const async = require('async');
const mongoose = require('mongoose');

const Company = require('../../../models/company/Company');
const PrivateCompany = require('../../../models/private_campaign/PrivateCampaign');

module.exports = (req, res) => {
  Company.findById(mongoose.Types.ObjectId(req.session.company._id.toString()), (err, company) => {
    if (err) return res.redirect('/');

    async.times(
      company.campaigns.length,
      (time, next) => {
        PrivateCompany.findById(mongoose.Types.ObjectId(company.campaigns[time]), (err, campaign) => next(err, {
          _id: campaign._id,
          name: campaign.name,
          photo: campaign.photo,
          status: campaign.status,
          reject_message: campaign.reject_message
        }));
      },
      (err, campaigns) => {
        if (err) return res.redirect('/');

        return res.render('dashboard/index', {
          page: 'dashboard/index',
          title: res.__('Ana Sayfa'),
          includes: {
            external: ['css', 'js', 'fontawesome']
          },
          campaigns
        });
      }
    )
  })
}
