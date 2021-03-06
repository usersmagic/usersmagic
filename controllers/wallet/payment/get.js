// Get /wallet/payment
// XMLHTTP Request

const Payment = require('../../../models/payment/Payment');

module.exports = (req, res) => {
  Payment.createPayment(req.query, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
