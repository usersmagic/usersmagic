const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Project = require('../project/Project');

const getFilters = require('./functions/getFilters');

const Schema = mongoose.Schema;

const TargetSchema = new Schema({
  project_id: {
    // The id of the Project the Target is created for
    type: String,
    required: true
  },
  country: {
    // The country of the testers
    type: String,
    required: true
  },
  filter: {
    // The filters that are used to find testers
    type: Array,
    required: true
  },
  submition_limit: {
    // The number of submitions that are allowed, if it is 0 no new user can join the project
    type: Number,
    default: 0
  },
  users_list: {
    // List of ids from User model. The users in this list can join this target group
    type: Array,
    default: []
  },
  joined_users_list: {
    // List of ids from User model. The users in this list have already joined the project, they cannot join one more time
    type: Array,
    default: []
  },
  price: {
    type: Number,
    default: null
  },
  time_limit: {
    type: Number,
    default: null
  }
});

TargetSchema.statics.getProjectsUserCanJoin = function (user_id, callback) {
  // Find Targets that the user with the given id can join, find and return their projects or an error if there is an error

  if (!user_id || !validator.isMongoId(user_id.toString()))
    return callback('bad_request');

  const Target = this;

  Target.find({$and: [
    {status: 'approved'},
    {users_list: user_id.toString()},
    {joined_users_list: {$ne: user_id.toString()}},
    {submition_limit: {$gt: 0}}
  ]}, (err, targets) => {
    if (err) return callback(err);

    async.timesSeries(
      targets.length,
      (time, next) => {
        Project.findProjectById(targets[time].project_id, (err, project) => {
          if (err) return next('database_error');

          project._id = targets[time]._id.toString(); // The user will join the Target with its id, not the project id
          project.price = targets[time].price;
          project.country = targets[time].country; // The country the user will be paid for
          project.time_limit = targets[time].time_limit;

          return next(null, project);
        });
      },
      (err, projects) => {
        if (err) return callback(err);

        return callback(null, projects);
      }
    );
  });
};

TargetSchema.statics.getFiltersForUser = function (id, callback) {
  // Changes the filters of the Target with the given id to be used as a search query, returns an object of filters with $and key or an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Target = this;

  Target.findById(mongoose.Types.ObjectId(id.toString()), (err, target) => {
    if (err) return callback(err);

    getFilters(target.filter, (err, filters) => {
      if (err) return callback(err);

      filters['$and'].push({country: target.country});

      return callback(null, filters);
    });
  });
};

TargetSchema.statics.leaveTarget = function (id, user_id, callback) {
  // Pulls the user_id from joined_users_list, pushes it from users_list and increase submition_limit by one. Returns the target object
  // If it cannot, returns an error

  if (!id || !validator.isMongoId(id.toString()) || !user_id || !validator.isMongoId(user_id.toString()))
    return callback('bad_request');

  const Target = this;

  Target.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {
    $push: { users_list: user_id.toString() },
    $pull: { joined_users_list: user_id.toString() },
    $inc: { submition_limit: 1 }
  }, {}, (err, target) => {
    if (err || !target) return callback('document_not_found');

    return callback(null, target);
  });
};

TargetSchema.statics.joinTarget = function (id, user_id, callback) {
  // Check if the given user_id can join the Target with the given id
  // If it can, adds it to joined_users_list, deletes it from users_list and decrease submition_limit by one. Returns the target object
  // If it cannot, returns an error

  if (!id || !validator.isMongoId(id.toString()) || !user_id || !validator.isMongoId(user_id.toString()))
    return callback('bad_request');

  const Target = this;

  Target.findOne({$and: [
    {_id: mongoose.Types.ObjectId(id.toString())},
    {users_list: user_id.toString()},
    {joined_users_list: {$ne: user_id.toString()}},
    {submition_limit: {$gt: 0}}
  ]}, (err, target) => {
    if (err || !target) return callback('document_not_found');

    Target.findByIdAndUpdate(mongoose.Types.ObjectId(target._id.toString()), {
      $pull: { users_list: user_id.toString() },
      $push: { joined_users_list: user_id.toString() },
      $inc: { submition_limit: -1 }
    }, {}, (err, target) => {
      console.log(err, target);
      if (err) return callback(err);

      return callback(null, target);
    });
  });
};

TargetSchema.statics.findByFields = function (fields, options, callback) {
  // Find a target with given fields or an error if it exists.
  // Returns error if '_id' or 'creator' field is not a mongodb object id

  const Target = this;

  const fieldKeys = Object.keys(fields);
  const fieldValues = Object.values(fields);

  if (!fieldKeys.length)
    return callback('bad_request');

  const filters = [];

  fieldKeys.forEach((key, iterator) => {
    if (key == '_id' || key == 'project_id') {
      if (!fieldValues[iterator] || !validator.isMongoId(fieldValues[iterator].toString()))
        return callback('bad_request');

      filters.push({[key]: mongoose.Types.ObjectId(fieldValues[iterator])});
    } else {
      filters.push({[key]: fieldValues[iterator]});
    }
  });

  Target.find({$and: filters}, (err, targets) => {
    if (err) return callback(err);

    return callback(null, targets);
  });
};

module.exports = mongoose.model('Target', TargetSchema);
