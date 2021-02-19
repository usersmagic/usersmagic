// Post /test/save route

const Submition = require('../../../../models/submition/Submition');

module.exports = (req, res) => {
  Submition.updateAnswersOfURLSubmition(req.query.id, req.session.custom_submition, req.body, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
