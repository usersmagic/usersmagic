const mongoose = require('mongoose');

const Company = require('../../../models/company/Company');

const uploadPhoto = require('../../../utils/uploadPhoto');

module.exports = (req, res) => {
  if (!req.file)
    return res.sendStatus(500);

  uploadPhoto(req.file.filename, req.file.size, (err, location) => {
    if (err) return res.sendStatus(500);

    Company.findByIdAndUpdate(mongoose.Types.ObjectId(req.session.company._id), {$push: {
      waiting_photos: location
    }}, {}, err => {
      if (err) return res.sendStatus(500);

      res.write(location);
      res.end();
    });
  });
}
