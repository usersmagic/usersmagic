const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  company_name: {
    type: String,
    required: true
  },
  details: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('Application', ApplicationSchema);
