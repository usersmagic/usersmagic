const async = require('async');
const mongoose = require('mongoose');

const Company = require('../../../../models/company/Company');
const PrivateCampaign = require('../../../../models/private_campaign/PrivateCampaign');

module.exports = (req, res) => {
  PrivateCampaign.find({
    status: {$ne: "waiting"},
    submitions: {$ne: []}
  }, (err, campaigns) => {
    if (err) return res.redirect('/admin');

    async.times(
      campaigns.length,
      (time, next) => {
        Company.findById(mongoose.Types.ObjectId(campaigns[time].creator), (err, company) => {
          next(err, {
            _id: campaigns[time]._id,
            name: campaigns[time].name,
            photo: campaigns[time].photo,
            company: company.company_name,
            approved: campaigns[time].accepted_submitions.length
          });
        });
      },
      (err, campaigns) => {
        if (err) return res.redirect('/admin');
        
        return res.render('admin/private_campaigns', {
          page: 'admin/private_campaigns',
          title: 'Özel Kampanyalar',
          includes: {
            external: ['css', 'admin_general_css', 'fontawesome']
          },
          campaigns
        });
      }
    );
  });
}
