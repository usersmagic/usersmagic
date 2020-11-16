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
  is_private_campaign: {
    type: Boolean,
    required: true
  },
  created_at: {
    type: Number,
    default: (new Date()).getTime()
  },
  ended_at: {
    type: Number,
    default: null
  },
  answers: {
    type: Object,
    default: {}
  },
  status: {
    type: String,
    default: "saved"
  },
  reject_message: {
    type: String,
    default: null
  },
  last_question: {
    type: Number,
    default: -1
  },
  will_terminate_at: {
    type: Number,
    default: null
  }
});

module.exports = mongoose.model('Submition', SubmitionSchema);
