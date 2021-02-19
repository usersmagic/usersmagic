const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const getProject = require('./functions/getProject');

const Submition = require('../submition/Submition');

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
  
    getProject(project, {}, (err, project) => {
      if (err) return callback(err);

      return callback(null, project);
    });
  });
};

ProjectSchema.statics.joinProjectFromCustomURL = function (id, callback) {
  // Join the project with the given id from a custom account
  // Return the id of the Submition that is created or an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Project = this;

  Project.findById(mongoose.Types.ObjectId(id.toString()), (err, project) => {
    if (err || !project)
      return callback('document_not_found');

    Submition.createURLSubmition({
      campaign_id: id,
      question_number: project.questions.length
    }, (err, submition) => {
      if (err) return callback(err);

      return callback(null, submition._id.toString());
    });
  });
};

ProjectSchema.statics.getSubmitionByIdOfCustomURL = function (submition_id, campaign_id, callback) {
  // Get the Submition with the given submition_id, match it with its project.
  // Return an object with campaign, submition and questions field, or an error if it exists

  if (!submition_id || !validator.isMongoId(submition_id) || !campaign_id || !validator.isMongoId(campaign_id))
    return callback('bad_request');

  const Project = this;

  Submition.findById(mongoose.Types.ObjectId(submition_id.toString()), (err, submition) => {
    if (err || !submition)
      return callback('document_not_found');

    Project.findById(mongoose.Types.ObjectId(submition.campaign_id.toString()), (err, project) => {
      if (err || !project)
        return callback('document_not_found');

        if (project._id.toString() != campaign_id.toString())
          return callback('document_validation');

        async.timesSeries(
          project.questions.length,
          (time, next) => {
            const question = project.questions[time];

            return next(null, {
              question,
              answer: submition.answers[question._id.toString()] || (question.type == 'checked' ? [] : '')
            });
          },
          (err, questions) => {
            if (err) return callback(err);

            getProject(project, {}, (err, project) => {
              if (err)
                return callback(err);

              return callback(null, {
                questions,
                campaign: project,
                submition: {
                  _id: submition._id.toString(),
                  last_question: submition.last_question
                }
              });
            });
          }
        );
    });
  });
}

module.exports = mongoose.model('Project', ProjectSchema);
