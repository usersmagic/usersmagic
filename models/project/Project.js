const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const getProject = require('./functions/getProject');
const validateQuestions = require('./functions/validateQuestions');

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
    // Status of the project: [saved, finished, deleted]
    type: String,
    default: 'saved'
  },
  created_at: {
    // UNIX date for the creation time of the object
    type: Date,
    default: Date.now()
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
  },
  country: {
    // The country of testers that the Project will use
    type: String,
    default: null
  }
});

ProjectSchema.statics.createProject = function (data, callback) {
  // Creates a new document under the model Project, returns the created project or an error if there is

  if (!data || !data.creator || !validator.isMongoId(data.creator.toString()) || !data.country)
    return callback('bad_request');

  const Project = this;
  const maxProjectLimit = 100; // The maximum project limit allowed per company
  const allowedProjectTypes = ['survey']; // For now only surveys are present

  Project.find({
    creator: mongoose.Types.ObjectId(data.creator)
  }, (err, projects) => {
    if (err) return callback('unknown_error');

    if (projects.length >= maxProjectLimit)
      return callback('too_many_documents');

    const newProjectData = {
      creator: data.creator,
      type: data.type || null,
      name: data.name,
      description: data.description,
      country: data.country,
      status: 'saved',
      image: data.image || null
    };

    if (!newProjectData.type || !allowedProjectTypes.includes(newProjectData.type) || !newProjectData.name || !newProjectData.name.length || !newProjectData.description || !newProjectData.description.length || !data.image || !data.image.length)
      return callback('bad_request');

    const newProject = new Project(newProjectData);

    newProject.save((err, project) => {
      if (err) return callback(err);

      getProject(project, {}, (err, project) => {
        if (err) return callback(err);

        return callback(null, project);
      });
    });
  });
}

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
      if (!fieldValues[iterator] || !validator.isMongoId(fieldValues[iterator].toString()))
        return callback('bad_request');

      filters.push({[key]: mongoose.Types.ObjectId(fieldValues[iterator].toString())});
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

ProjectSchema.statics.findByFields = function (fields, options, callback) {
  // Find a project with given fields or an error if it exists.
  // Returns error if '_id' or 'creator' field is not a mongodb object id

  const Project = this;

  const fieldKeys = Object.keys(fields);
  const fieldValues = Object.values(fields);

  if (!fieldKeys.length)
    return callback('bad_request');

  const filters = [];

  fieldKeys.forEach((key, iterator) => {
    if (key == '_id' || key == 'creator') {
      if (!fieldValues[iterator] || !validator.isMongoId(fieldValues[iterator].toString()))
        return callback('bad_request');

      filters.push({[key]: mongoose.Types.ObjectId(fieldValues[iterator])});
    } else {
      filters.push({[key]: fieldValues[iterator]});
    }
  });

  Project.find({$and: filters}, (err, projects) => {
    if (err) return callback(err);

    async.times(
      projects.length,
      (time, next) => getProject(projects[time], options, (err, project) => next(err, project)),
      (err, projects) => {
        if (err) return callback(err);

        return callback(null, projects);
      }
    );
  });
}

module.exports = mongoose.model('Project', ProjectSchema);
