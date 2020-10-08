const mongoose = require('mongoose');

const PrivateCampaign = require('../../../../models/private_campaign/PrivateCampaign');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)
    return res.redirect('/admin');

  PrivateCampaign.findById(mongoose.Types.ObjectId(req.query.id), (err, campaign) => {
    if (err) return res.redirect('/admin');

    return res.render('admin/private_campaigns/details', {
      page: 'admin/private_campaigns/details',
      title: campaign.name,
      includes: {
        external: ['css', 'admin_general_css', 'fontawesome']
      },
      campaign
    });
  })
}
