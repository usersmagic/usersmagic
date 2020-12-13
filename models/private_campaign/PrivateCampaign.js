const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PrivateCampaignSchema = new Schema({
  creator: {
    type: String,
    required: true
  },
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
    default: "saved"
  },
  reject_message: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  information: {
    type: String,
    default: null
  },
  price: {
    type: Number,
    default: null
  },
  country: {
    type: String,
    default: null
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
    default: null
  },
  time_limit: {
    type: Number,
    default: 7200000
  },
  questions: {
    type: Array,
    default: []
  },
  user_id_list: {
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
  },
  cities: {
    type: Array,
    default: null
  },
  email_list: {
    type: Array,
    default: null
  },
  test_url: {
    type: String,
    default: null
  },
  test_time_limit: {
    type: Number,
    default: 3600000
  }
});

module.exports = mongoose.model('PrivateCampaign', PrivateCampaignSchema);
