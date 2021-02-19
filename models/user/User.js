const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Campaign = require('../campaign/Campaign');
const Country = require('../country/Country');
const Project = require('../project/Project');
const Question = require('../question/Question');
const Submition = require('../submition/Submition');

const getUser = require('./functions/getUser');
const hashPassword = require('./functions/hashPassword');
const verifyPassword = require('./functions/verifyPassword');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    // Email address of the user
    type: String,
    unique: true,
    minlength: 1,
    required: true
  },
  password: {
    // Password of the user, saved hashed
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1000
  },
  agreement_approved: {
    // If user approved user agreement
    type: Boolean,
    default: false
  },
  completed: {
    // If user completed its account, cannot use the app without completing
    type: Boolean,
    default: false
  },
  country: {
    // Country of the user, required while completing account
    type: String,
    default: null
  },
  name: {
    // Name of the user, required while completing account
    type: String,
    default: null,
    maxlength: 1000
  },
  phone: {
    // Phone of the user, required while completing acount
    type: String,
    default: null,
    maxlength: 1000
  },
  gender: {
    // Gender of the user, required while completing acount. Possible values: [male, female, other, not_specified]
    type: String,
    default: null,
    maxlength: 1000
  },
  birth_year: {
    // Birth year of the user, required while completing acount
    type: Number,
    default: null
  },
  city: {
    // City of the user, required before joining a campaign/project
    type: String,
    default: null
  },
  town: {
    // Town of the user, required before joining a campaign/project
    type: String,
    default: null
  },
  information: {
    // Information field of the user, keeping question data for the user
    // Used to filter users by question from Question model
    type: Object,
    default: {}
  },
  paid_campaigns: {
    // List of ids for the campaigns/projects the user is paid for
    // Extra measure to prevent over payment
    type: Array,
    default: []
  },
  campaigns: {
    // List of ids of the campaigns the user is currently joined
    type: Array,
    default: []
  },
  payment_number: {
    // PayPal or Papara number of the user, required before user asking for a payment
    type: String,
    default: null
  },
  credit: {
    // The current credit of user, gained from campaigns or projects
    type: Number,
    default: 0
  },
  waiting_credit: {
    // The waiting credit of the user, still a document on the Payment model
    type: Number,
    default: 0
  },
  overall_credit: {
    // The overall credit of the user, updated after a waiting credit is complete
    type: Number,
    default: 0
  },
  invitor: {
    // Invitor (id of another user) of the user
    // If there is an invitor, the invitor gains 2 credits when the user receives a waiting credit
    type: String,
    default: null
  },
  password_reset_code: {
    // The secure code for resetting a password
    // Created when the user asks for a password reset
    // The code is send the user via email
    type: String,
    default: null
  },
  password_reset_last_date: {
    // The unix time that the password_reset_code will be deactivated
    // The user cannot reset his/her password using the password_reset_code after the password_reset_last_data passes
    type: Number,
    default: null
  },
  on_waitlist: {
    // Shows if the user is currently on waitlist or not, default to false for old users, always set true on a new user
    type: Boolean,
    default: false
  }
});

// Before saving the user to database, hash its password
UserSchema.pre('save', hashPassword);

UserSchema.statics.findUser = function (email, password, callback) {
  // Finds the user with the given email field, then verifies it with the given password
  // Returns the user or an error if there is one

  if (!email || !password || !validator.isEmail(email))
    return callback('bad_request');

  let User = this;

  User.findOne({ email: email.trim() }).then(user => { 
    if (!user)
      return callback('document_not_found');

    verifyPassword(password.trim(), user.password, res => {
      if (!res)
        return callback('password_verification');

      if (user.gender && (user.gender == 'erkek' || user.gender == 'kadın')) {
        User.findByIdAndUpdate(mongoose.Types.ObjectId(user._id.toString()), {$set: {
          gender: user.gender == 'erkek' ? 'male' : 'female'
        }}, {new: true}, (err, user) => {
          if (err) callback('database_error');

          getUser(user, (err, user) => {
            if (err) return callback(err);
    
            return callback(null, user);
          });
        });
      } else {
        getUser(user, (err, user) => {
          if (err) return callback(err);
  
          return callback(null, user);
        });
      }
    });
  });
};

UserSchema.statics.getUserById = function (id, callback) {
  // Finds the user with the given id and returns it without deleting any field, or an error if there is one
  // Do NOT use this function while sending it to frontend, use the user object on the cookie instead

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const User = this;

  User.findById(mongoose.Types.ObjectId(id), (err, user) => {
    if (err) return callback(err);

    return callback(null, user);
  });
};

UserSchema.statics.createUser = function (data, callback) {
  // Create a new User document with the given data, returns the user document or an error if it exists

  if (!data || typeof data != 'object' || !data.email || !data.password || typeof data.email != 'string' || typeof data.password != 'string')
    return callback('bad_request');

  if (!validator.isEmail(data.email))
    return callback('email_validation');

  if (data.password.length < 6)
    return callback('password_length');

  const User = this;

  const newUserData = {
    email: data.email,
    password: data.password,
    invitor: data.code && validator.isMongoId(data.code.toString()) ? data.code.toString() : null,
    agreement_approved: true,
    on_waitlist: true // Always true for a new user
  };

  const newUser = new User(newUserData);

  newUser.save((err, user) => {
    if (err && err.code == 11000) 
      return callback('email_duplication');
    if (err)
      return callback('database_error');

    getUser(user, (err, user) => {
      if (err) return callback(err);

      return callback(null, user);
    });
  });
};

UserSchema.statics.completeUser = function (id, data, callback) {
  // Update required fields of the user with given id, set completed field as true
  // Return an error if it exists

  const allowedGenderValues = ['male', 'female', 'other', 'not_specified'];

  if (!data || typeof data != 'object' || !id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  if (!data.name || typeof data.name != 'string')
    return callback('bad_request');

  data.phone = (data.phone ? data.phone.split(' ').join('') : null);

  if (!data.phone || !validator.isMobilePhone(data.phone.toString()))
    return callback('phone_validation');

  if (!data.gender || !allowedGenderValues.includes(data.gender))
    return callback('bad_request');

  if (!data.birth_year || isNaN(parseInt(data.birth_year)) || parseInt(data.birth_year) < 1920 || parseInt(data.birth_year) > 2020)
    return callback('bad_request');

  const User = this;

  Country.getCountryWithAlpha2Code(data.country, (err, country) => {
    if (err || !country)
      return callback('bad_request');

    User.findById(mongoose.Types.ObjectId(id.toString()), (err, user) => {
      if (err || !user) return callback('document_not_found');
  
      if (user.completed)
        return callback('already_authenticated');
      
      User.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
        name: data.name,
        country: country.alpha2_code,
        phone: data.phone,
        gender: data.gender,
        birth_year: parseInt(data.birth_year),
        completed: true
      }}, (err, user) => {
        if (err) return callback('database_error');
        if (!user) return callback('document_not_found');
      
        return callback(null);
      });
    });
  });
};

UserSchema.statics.updateUser = function (id, data, callback) {
  // Find and update the user document with id, update only all fields are valid. Not given fields are not updated
  // Return an error if it exists

  if (!id || !validator.isMongoId(id.toString()) || !data || typeof data != 'string')
    return callback('bad_request');

  const User = this;

  User.findById(mongoose.Types.ObjectId(id.toString()), (err, user) => {
    if (err || !user) return callback('document_not_found');

    if (data.city && data.town) {
      Country.validateCityAndTown(user.country, data, res => {
        if (!res) return callback('bad_request');

        User.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
          name: (data.name && typeof data.name == 'string' ? data.name : user.name),
          phone: (data.phone && validator.isMobilePhone(data.phone.toString()) ? data.phone : user.phone),
          city: data.city,
          town: data.town 
        }}, err => {
          if (err) return callback('database_error');
  
          return callback(null);
        });
      })
    } else {
      User.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
        name: (data.name && typeof data.name == 'string' ? data.name : user.name),
        phone: (data.phone && validator.isMobilePhone(data.phone.toString()) ? data.phone : user.phone)   
      }}, err => {
        if (err) return callback('database_error');

        return callback(null);
      });
    }
  });
};

UserSchema.statics.updateUserPaymentNumber = function (id, data, callback) {
  // Change the payment number of the user with the given id. Cannot be called for a second time
  // Return an error if it exists

  if (!id || !validator.isMongoId(id.toString()) || !data || typeof data != 'object' || !data.payment_number || isNaN(parseInt(data.payment_number.trim())))
    return callback('bad_request');

  const User = this;

  User.findById(mongoose.Types.ObjectId(id.toString()), (err, user) => {
    if (err || !user)
      return callback('document_not_found');

    if (user.payment_number)
      return callback('bad_request');

    User.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
      payment_number: data.payment_number.trim()
    }}, err => {
      if (err)
        return callback('database_error');

      return callback(null);
    });
  });
};

UserSchema.statics.findCampaignsForUser = function (user_id, callback) {
  // Finds and returns the campaigns that the given user_id can join, or returns an error if it exists

  if (!user_id || !validator.isMongoId(user_id.toString()))
    return callback('bad_request');

  const User = this;

  User.findById(mongoose.Types.ObjectId(user_id.toString()), (err, user) => {
    if (err || !user)
      return callback('document_not_found');

    if (user.gender == 'erkek')
      user.gender = 'male';
    
    if (user.gender == 'kadın')
      user.gender = 'female';

    Campaign.find({$and: [
      {_id: {$nin: user.campaigns}},
      {$or: [
        { gender: 'both' },
        { gender: user.gender }
      ]},
      {max_birth_year: { $gte: user.birth_year }},
      {min_birth_year: { $lte: user.birth_year }},
      {countries: user.country},
      {paused: false}
    ]}, (err, campaigns) => {
      if (err) return callback(err);

      async.timesSeries(
        campaigns.length,
        (time, next) => Campaign.getCampaignById(campaigns[time]._id, (err, campaign) => next(err, campaign)),
        (err, campaigns) => {
          if (err) return callback(err);

          return callback(null, campaigns);
        }
      );
    });
  });
};

UserSchema.statics.joinCampaign = function (campaign_id, user_id, callback) {
  // Find the campaign with the given campaign_id and check if the user can join the campaign
  // If user can join create the submition and return the id or an error if it exists

  if (!campaign_id || !validator.isMongoId(campaign_id.toString()) || !user_id || !validator.isMongoId(user_id.toString()))
    return callback('bad_request');

  const User = this;

  User.findById(mongoose.Types.ObjectId(user_id.toString()), (err, user) => {
    if (err) return callback('database_error');
    
    Campaign.findOne({$and: [
      { _id: mongoose.Types.ObjectId(campaign_id) },
      { _id: {$nin: user.campaigns} },
      {$or: [
        { gender: 'both' },
        { gender: user.gender }
      ]},
      {max_birth_year: { $gte: user.birth_year }},
      {min_birth_year: { $lte: user.birth_year }},
      {countries: user.country},
      {paused: false}
    ]}, (err, campaign) => {
      if (err || !campaign) return callback('document_not_found');
  
      Submition.createSubmition({
        campaign_id: campaign._id.toString(),
        user_id: user._id,
        question_number: campaign.questions.length,
        is_private_campaign: false
      }, (err, submition) => {
        if (err) return callback('database_error');
  
        User.findByIdAndUpdate(mongoose.Types.ObjectId(user._id.toString()), {$push: {
          campaigns: campaign._id.toString()
        }}, {}, err => {
          if (err) return callback('database_error');
  
          return callback(null, submition._id.toString());
        });
      });
    });
  });
};

UserSchema.statics.getSubmitionCampaignAndQuestions = function (submition_id, user_id, callback) {
  // Get the Submition with given submition_id and user_id, find its campaign and questions, add answer of each question from User
  // Return an object with campaign and questions field, or an error if it exists

  if (!submition_id || !validator.isMongoId(submition_id.toString()) || !user_id || !validator.isMongoId(user_id.toString()))
    return callback('bad_request');

  Submition.findById(mongoose.Types.ObjectId(submition_id.toString()), (err, submition) => {
    if (err || !submition)
      return callback('document_not_found');

    if (submition.user_id != user_id.toString() || submition.status != 'saved')
      return callback('document_validation');

    Campaign.findById(mongoose.Types.ObjectId(submition.campaign_id), (err, campaign) => {
      if (err || !campaign)
        return callback('document_not_found');

        async.timesSeries(
          campaign.questions.length,
          (time, next) => {
            Question.findById(mongoose.Types.ObjectId(campaign.questions[time]), (err, question) => {
              if (err) return next('database_erorr');
  
              return next(null, {
                question,
                answer: submition.answers[question._id.toString()] || (question.type == 'checked' ? [] : '')
              });
            });
          },
          (err, questions) => {
            if (err) return callback(err);

            Campaign.getCampaignById(campaign._id, (err, campaign) => {
              if (err) return callback(err);

              return callback(null, {
                questions,
                campaign,
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
};

UserSchema.statics.getInReviewSubmitionsOfUser = function (user_id, callback) {
  // Finds and returns 'saved' and 'waiting' submitions of the user on the appropriate format, or an error if it exists

  if (!user_id || !validator.isMongoId(user_id.toString()))
    return callback('bad_request');

  Submition
    .find({
      user_id: user_id.toString(),
      status: {$in: ['saved', 'waiting']}
    })
    .sort({
      created_at: -1
    })
    .then(submitions => {
      async.timesSeries(
        submitions.length,
        (time, next) => {
          const submition = submitions[time];

          if (submition.is_private_campaign) {
            if (submition.will_terminate_at > (new Date()).getTime() || submition.status != 'saved') {
              Project.findById(mongoose.Types.ObjectId(submition.campaign_id), (err, project) => {
                if (err || !project) {
                  Submition.findByIdAndDelete(mongoose.Types.ObjectId(submition._id.toString()), err => next('database_error'));
                } else {
                  return next(null, {
                    _id: submition._id.toString(),
                    is_private_campaign: true,
                    campaign: {
                      name: project.name,
                      image: project.image,
                      description: project.description,
                      price: project.price,
                      is_free: false
                    },
                    error: submition.reject_message,
                    status: submition.status,
                    last_question: submition.last_question,
                    will_terminate_at: submition.will_terminate_at
                  });
                }
              });
            } else {
              Target.leaveTarget(submition.target_id, user._id, () => {
                Submition.findByIdAndUpdate(mongoose.Types.ObjectId(submition._id.toString()), {$set: {
                  status: 'timeout'
                }}, err => next('database_error'));
              });
            }
          } else {
            Campaign.findById(mongoose.Types.ObjectId(submition.campaign_id), (err, campaign) => {
              if (err || !campaign) {
                Submition.findByIdAndDelete(mongoose.Types.ObjectId(submition._id.toString()), err => next('database_error'));
              } else {
                return next(null, {
                  _id: submition._id.toString(),
                  is_private_campaign: false,
                  campaign: {
                    name: campaign.name,
                    image: campaign.image || campaign.photo,
                    description: campaign.description,
                    price: campaign.price,
                    is_free: campaign.is_free
                  },
                  error: submition.reject_message,
                  status: submition.status
                });
              }
            });
          }
        },
        (err, submitions) => {
          if (err) return callback(err);

          submitions = submitions.filter(submition => submition && submition._id); // Filter any empty submitions that occured because of errors
    
          return callback(null, submitions);
        }
      );
    })
    .catch((err) => {
      console.log(err);
      return callback('database_error');
    });
};

UserSchema.statics.getCompletedSubmitionsOfUser = function (user_id, callback) {
  // Finds and returns 'approved', 'unapproved' and 'timeout' submitions of the user on the appropriate format, or an error if it exists

  if (!user_id || !validator.isMongoId(user_id.toString()))
    return callback('bad_request');

  Submition
    .find({
      user_id: user_id.toString(),
      status: {$in: ['approved', 'unapproved', 'timeout']}
    })
    .sort({
      created_at: -1
    })
    .then(submitions => {
      async.timesSeries(
        submitions.length,
        (time, next) => {
          const submition = submitions[time];

          if (submition.is_private_campaign) {
            Project.findById(mongoose.Types.ObjectId(submition.campaign_id), (err, project) => {
              if (err || !project) {
                Submition.findByIdAndDelete(mongoose.Types.ObjectId(submition._id.toString()), err => next(err));
              } else {
                return next(null, {
                  _id: submition._id.toString(),
                  is_private_campaign: true,
                  campaign: {
                    name: project.name,
                    image: project.image,
                    description: project.description,
                    price: project.price,
                    is_free: false
                  },
                  error: submition.reject_message,
                  status: submition.status,
                  last_question: submition.last_question,
                  will_terminate_at: submition.will_terminate_at
                });
              }
            });
          } else {
            Campaign.findById(mongoose.Types.ObjectId(submition.campaign_id), (err, campaign) => {
              if (err || !campaign) {
                Submition.findByIdAndDelete(mongoose.Types.ObjectId(submition._id.toString()), err => next(err));
              } else {
                return next(null, {
                  _id: submition._id.toString(),
                  is_private_campaign: false,
                  campaign: {
                    name: campaign.name,
                    image: campaign.image || campaign.photo,
                    description: campaign.description,
                    price: campaign.price,
                    is_free: campaign.is_free
                  },
                  error: submition.reject_message,
                  status: submition.status
                });
              }
            });
          }
        },
        (err, submitions) => {
          if (err) return callback(err);

          submitions = submitions.filter(submition => submition && submition._id); // Filter any empty submitions that occured because of errors
    
          return callback(null, submitions);
        }
      );
    })
    .catch(() => {
      return callback('database_error');
    });
};

module.exports = mongoose.model('User', UserSchema);
