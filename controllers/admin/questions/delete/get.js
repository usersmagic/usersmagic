const mongoose = require('mongoose');
const validator = require('validator');

const Campaign = require('../../../../models/campaign/Campaign');
const Question = require('../../../../models/question/Question');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !validator.isMongoId(req.query.id))
    return res.redirect('/admin');

  Campaign.find({
    questions: req.query.id
  }, (err, campaigns) => {
    if (err) return res.redirect('/admin');

    if (campaigns && campaigns.length) return res.redirect('/admin');

    Question.findByIdAndDelete(mongoose.Types.ObjectId(Req.query.id), err => {
      if (err) return res.redirect('/admin');

      return res.redirect('/admin/questions');
    })
  });
}
