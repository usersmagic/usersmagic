const mongoose = require('mongoose');
const validator = require('validator');

const Submition = require('../../../../models/submition/Submition');

module.exports = (req, res) => {
  if (!req.query || !req.body.id || !validator.isMongoId(req.body.id))
    return res.sendStatus(400);

  Submition.findOneAndUpdate({
    _id: mongoose.Types.ObjectId(req.body.id),
    user_id: req.session.user._id.toString()
  }, {$set: {
    status: "waiting"
  }}, {}, err => {
    if (err) return res.sendStatus(500);
  
    return res.sendStatus(200);
  });
}
