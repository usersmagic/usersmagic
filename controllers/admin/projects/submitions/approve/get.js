const mongoose = require('mongoose');

const Submition = require('../../../../../models/submition/Submition');

module.exports = (req, res) => {
  Submition.approveSubmitionById(req.query ? req.query.id : null, (err, submition) => {
    if (err) return res.redirect('/admin');

    return res.redirect(`/admin/projects/submitions?id=${submition.campaign_id}`);
  });
}
