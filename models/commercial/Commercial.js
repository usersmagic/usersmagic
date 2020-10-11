const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommercialSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  filter_string: {
    type: String,
    required: true
  },
  deleted: {
    type: Boolean,
    default: false
  },
  users: {
    type: Array,
    default: []
  },
  clicked_users: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model('Commercial', CommercialSchema);
