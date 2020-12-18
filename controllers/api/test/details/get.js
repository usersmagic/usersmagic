const mongoose = require('mongoose');
const validator = require('validator');

const Test = require('../../../../models/test/Test');

module.exports = (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  if (!req.query || !req.query.id || !validator.isMongoId(req.query.id))
    return res.status(400).json({ error: "bad request" });

  Test.findById(mongoose.Types.ObjectId(req.query.id), (err, test) => {
    if (err) return res.status(500).json({ error: "unknown" });
    if (!test) return res.status(404).json({ error: "not found" });

    return res.status(200).json({
      url: test.url
    });
  });
}
