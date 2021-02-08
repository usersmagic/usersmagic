const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const User = require('../user/User');

const approveSubmition = require('./functions/approveSubmition');

const Schema = mongoose.Schema;

const SubmitionSchema = new Schema({
  campaign_id: {
    // Id of the campaign that the submition is created for
    type: String,
    required: true
  },
  user_id: {
    // Id of the user that the submition is created for
    type: String,
    required: true
  },
  target_id: {
    // Id of the target group for private campaigns,
    type: String,
    default: null
  },
  type: {
    // Type of the submition: [url, target]
    type: String,
    default: 'target'
  },
  is_private_campaign: {
    // Info of the submition showing if it belongs to a private campaign
    type: Boolean,
    required: true
  },
  created_at: {
    // The unixtime that the submition is created
    type: Number,
    default: (new Date()).getTime()
  },
  ended_at: {
    // The unixtime the submition is ended
    type: Number,
    default: null
  },
  answers: {
    // Answers array, matching the questions of the project
    type: Object,
    default: {}
  },
  status: {
    // Status of the submition: [saved, waiting, approved, unapproved, timeout]
    type: String,
    default: 'saved'
  },
  reject_message: {
    // Reject message about the submition, if its status is unapproved
    type: String,
    default: null
  },
  last_question: {
    // Last question that the user answer on the submition
    type: Number,
    default: -1
  },
  will_terminate_at: {
    // The unixtime the submition will timeout, if is is a private campaign
    type: Number,
    default: null
  }
});

SubmitionSchema.statics.createSubmition = function (data, callback) {
  // Creates a submition with the given data and returns it or an error if it exists

  if (!data || !data.campaign_id || !validator.isMongoId(data.campaign_id.toString()) || !data.user_id || !validator.isMongoId(data.user_id.toString()) || !data.question_number || !Number.isInteger(data.question_number))
    return callback('bad_request');

  const Submition = this;
  const timeout = 7200000;

  const newSubmitionData = {
    type: data.type ? data.type : 'target',
    campaign_id: mongoose.Types.ObjectId(data.campaign_id.toString()),
    user_id: mongoose.Types.ObjectId(data.user_id.toString()),
    target_id: data.target_id && validator.isMongoId(data.target_id.toString()) ? mongoose.Types.ObjectId(data.target_id.toString()) : null,
    is_private_campaign: data.is_private_campaign,
    will_terminate_at: data.is_private_campaign ? (new Date()).getTime() + timeout : null,
    answers: Array.from({length: data.question_number}, () => '')
  };

  const newSubmition = new Submition(newSubmitionData);

  newSubmition.save((err, submition) => {
    if (err) return callback(err);

    Submition.collection
      .createIndex({
        user_id: -1,
        status: 'text',
        created_at: -1
      })
      .then(() => {
        return callback(null, submition);
      })
      .catch(err => {
        return callback('indexing_error');
      });
  });
};

SubmitionSchema.statics.findOneByIdAndUser = function (id, user_id, callback) {
  // Finds and returns the submition with the given id and user_id or an error if it exists

  if (!id || !validator.isMongoId(id.toString()) || !user_id || !validator.isMongoId(user_id.toString()))
    return callback('bad_request');

  const Submition = this;

  Submition.findOne({
    _id: mongoose.Types.ObjectId(id.toString()),
    user_id: mongoose.Types.ObjectId(user_id)
  }, (err, submition) => {
    if (err || !submition) return callback('document_not_found');

    return callback(null, submition);
  });
};

SubmitionSchema.statics.getSubmitionsByProjectId = function (data, callback) {
  // Finds and returns submitions with the given id or an error if it exists

  if (!data || !data.id || !validator.isMongoId(data.id.toString()))
    return callback('bad_request');

  const Submition = this;
  const page = (data.page && !isNaN(parseInt(data.page))) ? parseInt(data.page) : 0;
  const limit = (data.limit && !isNaN(parseInt(data.limit))) ? parseInt(data.limit) : 100;

  Submition
    .find({
      campaign_id: data.id.toString(),
      status: 'waiting'
    })
    .sort({ created_at: 1 })
    .skip(page * limit)
    .limit(limit)
    .then(submitions => {
      async.timesSeries(
        submitions.length,
        (time, next) => {
          User.getUserById(submitions[time].user_id, (err, user) => {
            if (err) return next(err);

            submitions[time].user = user;
            return next(null, submitions[time]);
          });
        },
        (err, submitions) => {
          if (err) return callback(err);

          return callback(null, submitions);
        }
      );
    })
    .catch(err => callback(err));
};

SubmitionSchema.statics.approveSubmitionById = function (id, callback) {
  // Finds and updates status of submition with the given id as 'approved', returns an error if exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Submition = this;

  Submition.findById(mongoose.Types.ObjectId(id.toString()), (err, submition) => {
    if (err) return callback('document_not_found');

    approveSubmition(submition, err => {
      if (err) return callback(err);

      Submition.findByIdAndUpdate(mongoose.Types.ObjectId(id), {$set: {
        status: 'approved'
      }}, {new: true}, (err, submition) => {
        if (err) return callback(err);

        return callback(null, submition);
      });
    });
  });
};

SubmitionSchema.statics.rejectSubmitionById = function (id, data, callback) {
  // Finds and updates status of submition with the given id as 'unapproved' and sets its reject_message to the given error, returns an error if it exists

  if (!data || !id || !validator.isMongoId(id.toString()) || !data.reason || !data.reason.length)
    return callback('bad_request');

  const Submition = this;

  Submition.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
    status: 'unapproved',
    reject_message: data.reason,
    ended_at: (new Date()).getTime()
  }}, {new: true}, (err, submition) => {
    if (err) return callback(err);

    return callback(null, submition);
  });
};

SubmitionSchema.statics.updateAnswers = function (id, user_id, data, callback) {
  // Find the submition with the given id and user_id, update its answers and last_question
  // Return an error if it exists

  if (!id || !validator.isMongoId(id.toString()) || !user_id || !validator.isMongoId(user_id.toString()) || !data || typeof data != 'object')
    return callback('bad_request');

  if (!data.answers || typeof data.answers != 'object' || isNaN(parseInt(data.last_question)))
    return callback('bad_request');

  const Submition = this;

  Submition.findById(mongoose.Types.ObjectId(id.toString()), (err, submition) => {
    if (err || !submition)
      return callback('document_not_found');

    if (submition.user_id != user_id.toString() || submition.status != 'saved')
      return callback('document_validation');

    if (Object.keys(submition.answers).find(key => data.answers[key] && typeof submition.answers[key] != typeof data.answers[key])) 
      return callback('database_error');

    Submition.findOneAndUpdate({
      _id: mongoose.Types.ObjectId(id.toString()),
      user_id: user_id.toString()
    }, {$set: {
      answers: data.answers,
      last_question: parseInt(data.last_question)
    }}, (err, submition) => {
      if (err || !submition)
        return callback('document_not_found');
    
      return callback(null);
    });
  });
};

SubmitionSchema.statics.submitAnswers = function (id, user_id, callback) {
  // Find the submition with the given id and user_id, update its status as waiting if it is saved
  // Return an error if it exists

  if (!id || !validator.isMongoId(id.toString()) || !user_id || !validator.isMongoId(user_id.toString()))
    return callback('bad_request');

  const Submition = this;

  Submition.findById(mongoose.Types.ObjectId(id.toString()), (err, submition) => {
    if (err || !submition)
      return callback('document_not_found');

    if (submition.user_id != user_id.toString() || submition.status != 'saved')
      return callback('document_validation');

    Submition.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
      status: 'waiting'
    }}, err => {
      if (err)
        return callback('database_error');

      Submition.collection
        .createIndex({
          user_id: -1,
          status: 'text',
          created_at: -1
        })
        .then(() => {
          return callback(null, submition);
        })
        .catch(err => {
          return callback('indexing_error');
        });
    });
  });
};

module.exports = mongoose.model('Submition', SubmitionSchema);
