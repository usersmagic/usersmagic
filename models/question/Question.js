const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  answer_length: {
    type: Number,
    default: 1000
  },
  choices: {
    type: Array,
    default: null
  },
  min_value: {
    type: Number,
    default: 0
  },
  max_value: {
    type: Number,
    default: 10
  },
  min_explanation: {
    type: String,
    default: ""
  },
  max_explanation: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model('Question', QuestionSchema);
