const mongoose = require('mongoose');

const Application = require('../../../../models/application/Application');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)
    return res.redirect('/admin');

  Application.findByIdAndDelete(mongoose.Types.ObjectId(req.query.id), err => {
    if (err) return res.redirect('/admin');

    return res.redirect('/admin/applications');
  });
}
