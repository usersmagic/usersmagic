const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const Country = require('../country/Country');
const User = require('../user/User');

const PaymentSchema = new Schema({
  amount: {
    // Amount of the payment
    type: Number,
    required: true
  },
  user_id: {
    // The user that the payment will be made for
    type: String,
    required: true
  },
  payment_number: {
    // The payment number of the user. Keeped in case of an error on user side, such as deleting user
    type: String,
    required: true
  },
  created_at: {
    // The date this payment is created for the user
    type: Date,
    default: Date.now()
  }
});

PaymentSchema.statics.createPayment = function (data, callback) {
  // Create a new Payment document and return its id, or an error if it exists

  if (!data || typeof data != 'object' || !data.user_id || !validator.isMongoId(data.user_id.toString()))
    return callback('bad_request');

  const Payment = this;

  User.getUserById(data.user_id, (err, user) => {
    if (err) return callback(err);

    Country.getCountryWithAlpha2Code(user.country, (err, country) => {
      if (err) return callback(err);

      if (user.credit < country.min_payment_amount)
        return callback('bad_request');
      
      const credit = country.min_payment_amount * parseInt(user.credit / country.min_payment_amount);

      User.findByIdAndUpdate(mongoose.Types.ObjectId(user._id.toString()), {$inc: {
        credit: -1 * credit,
        waiting_credit: credit
      }}, err => {
        if (err) return callback(err);

        const newPaymentData = {
          user_id: data.user_id.toString(),
          amount: credit,
          payment_number: user.payment_number,
          created_at: Date.now()
        };

        const newPayment = new Payment(newPaymentData);

        newPayment.save((err, payment) => {
          if (err) return callback(err);

          return callback(null, payment._id.toString());
        });
      });
    });
  });
};

module.exports = mongoose.model('Payment', PaymentSchema);
