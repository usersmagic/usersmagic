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

ProjectSchema.statics.findProjectById = function (id, callback) {
  // Find the project with the given id and return it after formatting, or an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');
  
  const Project = this;

  Project.findById(mongoose.Types.ObjectId(id.toString()), (err, project) => {
    if (err || !project)
      return callback('document_not_found');
  
    getProject(project, (err, project) => {
      if (err) return callback(err);

      return callback(null, project);
    });
  });
};

module.exports = mongoose.model('Project', ProjectSchema);
