// Post /test/campaign/submit route
// XMLHTTP Request

const Submition = require('../../../../models/submition/Submition');

module.exports = (req, res) => {
  Submition.submitAnswers(req.query.id, req.session.user._id, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
