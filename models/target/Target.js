const mongoose = require('mongoose');
const validator = require('validator');

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
  }
});

TargetSchema.statics.findPossibleTargetGroupsForUser = function (user_id, callback) {
  // Finds the projects that the user with the given id can join, returns projects or an error if there is an error

  if (!user_id || !validator.isMongoId(user_id.toString()))
    return callback('bad_request');

  const Target = this;

  Target.find({$and: [
    {users_list: user_id},
    {joined_users_list: {$ne: user_id}} 
  ]}, (err, targets) => {
    if (err) return callback(err);

    return callback(null, targets);
  });
}

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
}

TargetSchema.statics.leaveTarget = function (id, user_id, callback) {
  // Pulls the user_id from joined_users_list, pushes it from users_list and increase submition_limit by one. Returns the target object
  // If it cannot, returns an error

  if (!id || !validator.isMongoId(id.toString()) || !user_id || !validator.isMongoId(user_id.toString()))
    return callback('bad_request');

  const Target = this;

  Target.findByIdAndUpdate(mongoose.Types.ObjectId(target._id.toString()), {
    $push: { users_list: user_id.toString() },
    $pull: { joined_users_list: user_id.toString() },
    $inc: { submition_limit: 1 }
  }, {}, (err, target) => {
    if (err || !target) return callback('document_not_found');

    return callback(null, target);
  });
}

TargetSchema.statics.joinTarget = function (id, user_id, callback) {
  // Check if the given user_id can join the Target with the given id
  // If it can, adds it to joined_users_list, deletes it from users_list and decrease submition_limit by one. Returns the target object
  // If it cannot, returns an error

  if (!id || !validator.isMongoId(id.toString()) || !user_id || !validator.isMongoId(user_id.toString()))
    return callback('bad_request');

  const Target = this;

  Target.findOne({$and: [
    {users_list: user_id.toString()},
    {$ne: {joined_users_list: user_id.toString()}} 
  ]}, (err, target) => {
    if (err || !target) return callback('document_not_found');

    Target.findByIdAndUpdate(mongoose.Types.ObjectId(target._id.toString()), {
      $pull: { users_list: user_id.toString() },
      $push: { joined_users_list: user_id.toString() },
      $inc: { submition_limit: -1 }
    }, {}, (err, target) => {
      if (err) return callback(err);

      return callback(null, target);
    });
  });
}

module.exports = mongoose.model('Target', TargetSchema);
