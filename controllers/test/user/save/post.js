const mongoose = require('mongoose');

const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (!req.body || !req.body.answers || !req.body.id)
    return res.sendStatus(400);

  if (!req.body.is_private_campaign) {
    User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
      if (err || !user) return res.sendStatus(500);
  
      const information = user.information || {};
  
      Object.keys(req.body.answers).forEach((id, time) => {
        if (Object.values(req.body.answers)[time] && Object.values(req.body.answers)[time].length)
          information[id] = Object.values(req.body.answers)[time];
      });
  
      User.findByIdAndUpdate(mongoose.Types.ObjectId(req.session.user._id), {$set: {
        information,
        ["campaign_last_question." + req.body.id]: (req.body.question || -1) + 1
      }}, (err, user) => {
        if (err || !user) return res.sendStatus(500);
  
        return res.sendStatus(200);
      });
    }); 
  } else {
    User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
      if (err || !user) return res.sendStatus(500);
  
      const information = user.private_campaign_informations || {};
      const campaign_last_question = user.campaign_last_question;
  
      campaign_last_question[req.body.id] = (req.body.question || -1) + 1;
  
      Object.keys(req.body.answers).forEach((id, time) => {
        if (Object.values(req.body.answers)[time] && Object.values(req.body.answers)[time].length)
          information[id] = Object.values(req.body.answers)[time];
      });
  
      User.findByIdAndUpdate(mongoose.Types.ObjectId(req.session.user._id), {$set: {
        private_campaign_informations: information,
        campaign_last_question
      }}, (err, user) => {
        if (err || !user) return res.sendStatus(500);
  
        return res.sendStatus(200);
      });
    });
  }
}
