const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  name: {
    // Name of the questions, visible to admin and companies
    type: String,
    required: true
  },
  description: {
    // Description of the question, visible to admin
    type: String,
    required: true
  },
  text: {
    // The question text
    type: String,
    required: true
  },
  type: {
    // Type of the question: [short_text, long_text, checked, radio, range]
    type: String,
    required: true
  },
  answer_length: {
    // The allowed answer length for the question, used in short_text and long_text
    type: Number,
    default: 1000
  },
  choices: {
    // An array of strings, showing the choices for checked and radio types
    type: Array,
    default: null
  },
  other_option: {
    // A boolean value showing if other option is open for this checked/radio question
    type: Boolean,
    default: false
  },
  min_value: {
    // Min value of range question
    type: Number,
    default: 0
  },
  max_value: {
    // Max value of range question
    type: Number,
    default: 10
  },
  min_explanation: {
    // Min value explanation for range question
    type: String,
    default: ''
  },
  max_explanation: {
    // Max value explanation for range question
    type: String,
    default: ''
  },
  countries: {
    // Countries that the question can be used to filter
    // Different than the countries of the Campaign, this is only important for company side
    type: Array,
    default: ['tr']
  }
});

module.exports = mongoose.model('Question', QuestionSchema);
