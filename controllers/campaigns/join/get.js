// Get /campaign/join to join a Target

const User = require('../../../models/user/User');

module.exports = (req, res) => {
  User.joinTarget(req.query.id, req.session.user._id, (err, submition_id) => {
    if (err) return res.redirect('/campaigns');

    return res.redirect('/test/campaign?id=' + submition_id);
  });
}
