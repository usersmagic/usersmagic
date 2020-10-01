const async = require('async');

const User = require('../../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !req.query.value)
    return res.redirect('/admin');

  const fieldName = "information." + req.query.id;

  User.find({$or: [
    {[fieldName]: req.query.value},
    {[fieldName]: req.query.value + " "},
    {[fieldName]: " " + req.query.value}
  ]}, (err, users) => {
    if (err) return res.redirect('/admin');

    return res.json({
      users: users.map(user => {return {
        name: user.name,
        email: user.email,
        phone: user.phone
      }})
    });
  })
}
