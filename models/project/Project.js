const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const getProject = require('./functions/getProject');

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  creator: {
    // Creator of the project, a document if from Company model
    type: String,
    required: true,
    unique: false
  },
  type: {
    // Type of the project: [survey, web_test, app_test]
    type: String,
    required: true
  },
  status: {
    // Status of the project: [saved, waiting, approved, deleted]
    type: String,
    default: 'saved'
  },
  created_at: {
    // UNIX date for the creation time of the object
    type: Date,
    default: Date.now()
  },
  error: {
    // Error about the project, if there is any
    type: String,
    default: null,
    maxlength: 1000
  },
  name: {
    // Name of the project
    type: String,
    required: true,
    maxlength: 1000
  },
  image: {
    // Image of the project
    type: String,
    required: true,
    maxlength: 1000
  },
  description: {
    // Description of the project,
    type: String,
    default: '',
    maxlength: 1000
  },
  questions: {
    // Questions array
    type: Array,
    default: []
  },
  welcome_screen: {
    // Content of the welcome_screen
    type: Object,
    default: {
      opening: '',
      details: '',
      image: ''
    }
  }
});

ProjectSchema.statics.findOneByFields = function (fields, options, callback) {
  // Returns a project with given fields or an error if it exists.
  // Returns error if '_id' or 'creator' field is not a mongodb object id

  const Project = this;

  const fieldKeys = Object.keys(fields);
  const fieldValues = Object.values(fields);

  if (!fieldKeys.length)
    return callback('bad_request');

  const filters = [];

  fieldKeys.forEach((key, iterator) => {
    if (key == '_id' || key == 'creator') {
      if (!validator.isMongoId(fieldValues[iterator].toString()))
        return callback('bad_request');

      filters.push({[key]: mongoose.Types.ObjectId(fieldValues[iterator])});
    } else {
      filters.push({[key]: fieldValues[iterator]});
    }
  });

  Project.findOne({$and: filters}, (err, project) => {
    if (err) return callback(err);

    getProject(project, options, (err, project) => {
      if (err) return callback(err);

      return callback(null, project)
    });
  });
}

module.exports = mongoose.model('Project', ProjectSchema);
