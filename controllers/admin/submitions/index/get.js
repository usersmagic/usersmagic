const mongoose = require('mongoose');

const Campaign = require('../../../../models/campaign/Campaign');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)
    return res.redirect('/admin');

  Campaign.findById(mongoose.Types.ObjectId(req.query.id), (err, campaign) => {
    if (err || !campaign) return res.redirect('/admin');

    return res.render('admin/submitions', {
      page: 'admin/submitions',
      title: campaign.name,
      includes: {
        external: ['css', 'admin_general_css', 'fontawesome']
      },
      campaign
    });
  });
}
