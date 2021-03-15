// Post /test/campaign/save route

const Submition = require('../../../../models/submition/Submition');

module.exports = (req, res) => {
  Submition.updateAnswers(req.query.id, req.session.user._id, req.body, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
