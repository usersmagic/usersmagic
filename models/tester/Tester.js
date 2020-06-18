const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TesterSchema = new Schema({
  email: {
    type: String,
    unique: true,
    minlength: 1,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  birth_time: {
    type: Object,
    default: {
      day: null,
      month: null,
      year: null
    }
  },
  phone: {
    type: String,
    required: true
  },
  profession: {
    type: String,
    default: null
  },
  last_school: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Tester', TesterSchema);
