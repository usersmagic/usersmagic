const async = require('async');
const mongoose = require('mongoose');

const Company = require('../../../../models/company/Company');

const deletePhoto = require('../../../../utils/deletePhoto');

module.exports = (req, res) => {
  if (!req.body || !req.body.email || !req.body.password)
    return res.redirect('/');

  Company.findCompany(req.body.email.trim(), req.body.password, (err, company) => {
    if (err || !company)
      return res.redirect('/auth/company/login');

    req.session.company = company;

    if (!company.completed)
      return res.redirect('/auth/company/complete');

    async.times(
      company.waiting_photos.length,
      (time, next) => deletePhoto(company.waiting_photos[time], err => next(err)),
      err => {
        if (err) return res.redirect('/auth/company/login');

        Company.findByIdAndUpdate(mongoose.Types.ObjectId(company._id), {$set: {
          waiting_photos: []
        }}, {new: true}, (err, company) => {
          if (err) return res.redirect('/auth/company/login');
          req.session.company = company;

          if (req.session.redirect)
            return res.redirect(req.session.redirect);
          else
            return res.redirect('/dashboard/company');
        });
      }
    );
  });
}
