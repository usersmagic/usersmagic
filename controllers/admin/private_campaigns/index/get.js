const PrivateCampaign = require('../../../../models/private_campaign/PrivateCampaign');

module.exports = (req, res) => {
  PrivateCampaign.find({
    status: "waiting"
  }, (err, campaigns) => {
    if (err) return res.redirect('/admin');

    return res.render('admin/private_campaigns', {
      page: 'admin/private_campaigns',
      title: 'Özel Kampanyalar',
      includes: {
        external: ['css', 'js', 'admin_general_css', 'fontawesome']
      },
      campaigns
    });
  })
}
