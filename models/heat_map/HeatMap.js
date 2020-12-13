const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HeatMapSchema = new Schema({
  test_id: {
    type: String,
    required: true
  },
  created_at: {
    type: Number,
    default: (new Date()).getTime()
  },
  location: {
    type: String,
    required: true
  },
  time: {
    type: Number,
    default: null
  },
  clicked_objects: {
    type: Array,
    default: []
  },
  positions: {
    type: Array,
    default: []
  },
  mouse_stand_still: {
    type: Array,
    default: []
  },
  scrolled: {
    type: Number,
    default: null
  },
  browser: {
    type: String,
    default: null
  },
  detailed_browser: {
    type: String,
    default: null
  },
  os: {
    type: String,
    default: null
  },
  plugins: {
    type: Array,
    default: []
  },
  coordinates: {
    type: Object,
    default: {}
  }
});

module.exports = mongoose.model('HeatMap', HeatMapSchema);
