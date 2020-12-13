const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TestSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  campaign_id: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  time_limit: {
    type: Number,
    required: true
  },
  is_completed: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Number,
    default: (new Date()).getTime()
  },
  min_time_limit: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Test', TestSchema);
