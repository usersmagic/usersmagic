const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PrivateCampaignSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "waiting"
  },
  reject_message: {
    type: String,
    default: null
  },
  description: {
    type: String,
    required: true
  },
  information: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  country: {
    type: Array,
    required: true
  },
  gender: {
    type: String,
    default: null
  },
  min_birth_year: {
    type: Number,
    default: null
  },
  max_birth_year: {
    type: Number,
    default: null
  },
  submition_limit: {
    type: Number,
    required: true
  },
  time_limit: {
    type: Number,
    default: 7200000
  },
  questions: {
    type: Array,
    default: []
  },
  submitions: {
    type: Array,
    default: []
  },
  accepted_submitions: {
    type: Array,
    default: []
  },
  accepted_submition_ids: {
    type: Array,
    default: []
  },
  filter: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model('PrivateCampaign', PrivateCampaignSchema);
