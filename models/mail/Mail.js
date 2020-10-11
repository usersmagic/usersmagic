const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MailSchema = new Schema({
  option_name: {
    type: String,
    required: true
  },
  limit: {
    type: Number,
    required: true
  },
  filter_string: {
    type: String,
    required: true
  },
  sended_users: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model('Mail', MailSchema);
