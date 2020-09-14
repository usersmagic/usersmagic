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
  approved: {
    type: Boolean,
    default: false
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
  filter: {
    type: Object,
    default: {}
  }
});

module.exports = mongoose.model('PrivateCampaign', PrivateCampaignSchema);