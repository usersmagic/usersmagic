const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  if (req.query && req.query.id && !validator.isMongoId(req.query.id))
    return res.status(400).json({ error: "bad request" });

  if (req.query && req.query.id) {
    User.findById(mongoose.Types.ObjectId(req.query.id), (err, user) => {
      if (err) return res.status(500).json({ error: err });
      if (!user) return res.status(400).json({ error: "user not found" });
  
      return res.status(200).json(user);
    });
  } else {
    User.find({}, (err, users) => {
      if (err) return res.status(500).json({ error: err });

      async.times(
        users.length,
        (time, next) => {
          return next(null, {
            _id: users[time]._id.toString(),
            name: users[time].name,
            email: users[time].email,
            phone: users[time].phone,
            gender: users[time].gender,
            birth_year: users[time].birth_year,
            payment_number: users[time].payment_number
          });
        },
        (err, users) => {
          if (err) return res.status(500).json({ error: err });

          return res.status(200).json(users);
        }
      );
    });
  }
}
