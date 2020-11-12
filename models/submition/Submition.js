const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SubmitionSchema = new Schema({
  campaign_id: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    required: true
  },
  created_at: {
    type: Number,
    default: (new Date()).getTime()
  },
  answers: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model('Submition', SubmitionSchema);
