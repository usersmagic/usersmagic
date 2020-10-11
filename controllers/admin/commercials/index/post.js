const async = require('async');
const cron = require('cron');
const mongoose = require('mongoose');

const CronJob = cron.CronJob;

const Commercial = require('../../../../models/commercial/Commercial');
const User = require('../../../../models/user/User');

const uploadPhoto = require('../../../../utils/uploadPhoto');

module.exports = (req, res) => {
  if (!req.body || !req.body.name || !req.body.url || !req.file || !req.file.filename)
    return res.redirect('/admin');

  uploadPhoto(req.file.filename, req.file.size, (err, location) => {
    if (err) return res.redirect('/admin');

    const newCommercialData = {
      name: req.body.name,
      url: req.body.url,
      filter_string: req.body.filter && req.body.filter.length ? req.body.filter.toString() : "birth_year: $gte: 1920, birth_year: $lte: 2020",
      photo: location
    };

    const newCommercial = new Commercial(newCommercialData);

    newCommercial.save((err, commercial) => {
      if (err) return res.redirect('/admin');

      let filterOptions = (req.body.filter && req.body.filter.length) ? req.body.filter.split(',').map(each => {
        const name =  each.trim().split(':')[0].trim();
        const value = each.trim().split(':')[1].trim();

        if (each.trim().split(':').length < 3)
          return {[name]: value == "null" ? null : value};
        
        return {[name]: {
          [value]: each.trim().split(':')[2].trim() == "null" ? null : each.trim().split(':')[2].trim()
        }}
      }) : [{birth_year: {$gte: 1920}}, {birth_year: {$lte: 2020}}];

      User.find({$and: filterOptions}, (err, users) => {
        if (err) return res.redirect('/admin');

        async.times(
          users.length,
          (time, next) => {
            User.findByIdAndUpdate(mongoose.Types.ObjectId(users[time]._id.toString()), {$push: {
              commercials: commercial._id.toString()
            }}, {}, err => next(err));
          },
          err => {
            if (err) return res.redirect('/admin');

            Commercial.findByIdAndUpdate(mongoose.Types.ObjectId(commercial._id), {$set: {
              users: commercial.users.concat(users.map(user => user._id.toString()))
            }}, {}, err => {
              if (err) return res.redirect('/admin');

              const job = new CronJob('00 * * * *', () => {
                Commercial.find({$and: [
                  {_id: mongoose.Types.ObjectId(commercial._id)},
                  {deleted: false}
                ]}, (err, commercial) => {
                  if (err) console.log(err);
                  if (err || !commercial || !commercial._id) return job.stop();
  
                  User.find({$and: [
                    {$and: filterOptions},
                    {$and: {$ne: {commercials: commercial._id.toString()}}}
                  ]}, (err, users) => {
                    if (err) console.log(err);
                    if (err) return job.stop();
  
                    async.times(
                      users.length,
                      (time, next) => {
                        User.findByIdAndUpdate(mongoose.Types.ObjectId(users[time]._id), {$push: {
                          commercials: commercial._id.toString()
                        }}, {}, (err, user) => next(err));
                      },
                      err => {
                        if (err) console.log(err);
                        if (err) return job.stop();

                        Commercial.findByIdAndUpdate(mongoose.Types.ObjectId(commercial._id), {$set: {
                          users: commercial.users.concat(users.map(user => user._id.toString()))
                        }}, {}, err => {
                          if (err) console.log(err);
                          if (err) return job.stop();
                        });
                      }
                    );
                  });
                });
              });
  
              job.start();
  
              return res.redirect('/admin/commercials');
            });
          }
        );
      });
    });
  });
}
