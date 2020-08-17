const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CampaignSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  questions: {
    type: Array,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  min_birth_year: {
    type: Number,
    required: true
  },
  max_birth_year: {
    type: Number,
    required: true
  },
  submitions: {
    type: Array,
    default: []
  },
  paused: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Campaign', CampaignSchema);
