const async = require('async');
const mongoose  = require('mongoose');

const Mail = require('../../../../models/mail/Mail');
const User = require('../../../../models/user/User');

const sendMail = require('../../../../utils/sendMail');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)
    return res.redirect('/admin');

  Mail.findById(mongoose.Types.ObjectId(req.query.id), (err, mail) => {
    if (err) return res.redirect('/admin');

    const filterOptions = mail.filter_string.split(',').map(each => {
      const name =  each.trim().split(':')[0].trim();
      const value = each.trim().split(':')[1].trim();

      if (each.trim().split(':').length < 3)
        return {[name]: value == "null" ? null : value};
      
      return {[name]: {
        [value]: each.trim().split(':')[2].trim() == "null" ? null : each.trim().split(':')[2].trim()
      }}
    });

    User.find({$and: [
      {_id: {$nin: mail.sended_users}},
      {$and: filterOptions}
    ]}, (err, users) => {
      if (err) return res.redirect('/admin');

      users = users.filter((user, i) => i < mail.limit)

      sendMail({
        emailList: users.map(user => user._id.toString())
      }, mail.option_name, err => {
        if (err) return res.redirect('/admin');

        Mail.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {$set: {
          sended_users: mail.sended_users.concat(users.map(user => user._id.toString()))
        }}, {}, err => {
          if (err) return res.redirect('/admin');

          return res.redirect('/admin/mails');
        })
      })
    })
  })
}
