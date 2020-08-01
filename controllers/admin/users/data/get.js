const mongoose = require('mongoose');
const validator = require('validator');

const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !validator.isMongoId(req.query.id))
    return res.status(400).json({ error: "bad request" });

  User.findById(mongoose.Types.ObjectId(req.query.id), (err, user) => {
    if (err) return res.status(500).json({ error: err });
    if (!user) return res.status(400).json({ error: "user not found" });

    return res.status(200).json(user);
  });
}
