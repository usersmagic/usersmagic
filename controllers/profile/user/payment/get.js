const mongoose = require('mongoose');

const User = require('../../../../models/user/User');
const Payment = require('../../../../models/payment/Payment');

module.exports = (req, res) => {
  User.findById(mongoose.Types.ObjectId(req.session.user._id), (err, user) => {
    if (err || !user) return res.redirect('/profile/user');

    if (user.credit < 10) {
      req.session.payment_error = res.__('Paranızı çekebilmek için bakiyeniz en az 10₺ olmalıdır');
      return res.redirect('/profile/user');
    }

    if (!user.payment_number) return res.redirect('/profile/user');

    const newPaymentData = {
      user_id: user._id,
      payment_number: user.payment_number,
      amount: 10
    };

    const newPayment = new Payment(newPaymentData);

    newPayment.save(err => {
      if (err) return res.redirect('/profile/user');

      User.findByIdAndUpdate(mongoose.Types.ObjectId(req.session.user._id), {$inc: {
        credit: -10,
        waiting_credit: 10
      }}, {new: true}, (err, user) => {
        if (err) return res.redirect('/profile/user');

        req.session.user = user;

        return res.redirect('/profile/user');
      });
    });
  });
}
