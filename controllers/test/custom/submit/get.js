// Post /test/submit route
// XMLHTTP Request

const Submition = require('../../../../models/submition/Submition');

module.exports = (req, res) => {
  Submition.submitAnswersofURLSubmition(req.query.id, req.session.custom_submition, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
