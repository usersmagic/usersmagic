const async = require('async');
const mongoose = require('mongoose');

const Company = require('../../../../models/company/Company');
const PrivateCampaign = require('../../../../models/private_campaign/PrivateCampaign');

module.exports = (req, res) => {
  Company.findById(mongoose.Types.ObjectId(req.session.company._id), (err, company) => {
    if (err || !company)
      return res.redirect('/');

    async.times(
      company.campaigns.length,
      (time, next) => {
        PrivateCampaign.findById(mongoose.Types.ObjectId(company.campaigns[time]),
          (err, campaign) => next(err, {
            _id: campaign._id,
            name: campaign.name,
            photo: campaign.photo,
            description: campaign.description,
            information: campaign.information,
            price: campaign.price,
            submitions: campaign.submitions
          }));
      },
      (err, campaigns) => {
        if (err) return res.redirect('/');

        return res.render('campaigns/company/index', {
          page: 'campaigns/company/index',
          title: res.__('Ana Sayfa'),
          includes: {
            external: ['css', 'js', 'fontawesome']
          },
          campaigns,
          currency: company.country == "tr" ? "₺" : (company.country == "us" ? "$" : "€"),
          current_page: "campaigns"
        });
      }
    )
  });
}
