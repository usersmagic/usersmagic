const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hashPassword = require('./functions/hashPassword');
const verifyPassword = require('./functions/verifyPassword');

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    minlength: 1,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  completed: {
    type: Boolean,
    default: false
  },
  country: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  gender: {
    type: String,
    default: null
  },
  birth_year: {
    type: Number,
    default: null
  },
  information: {
    type: Object,
    default: {}
  },
  saved_information: {
    type: Object,
    default: {}
  },
  campaigns: {
    type: Array,
    default: []
  },
  paid_campaigns: {
    type: Array,
    default: []
  },
  campaign_errors: {
    type: Object,
    default: {}
  },
  campaign_versions: {
    type: Object,
    default: {}
  },
  campaign_status: {
    type: Object,
    default: {}
  },
  payment_number: {
    type: String,
    default: null
  },
  credit: {
    type: Number,
    default: 0
  },
  waiting_credit: {
    type: Number,
    default: 0
  },
  overall_credit: {
    type: Number,
    default: 0
  },
  invitor: {
    type: String,
    default: null
  }
});

UserSchema.pre('save', hashPassword);

UserSchema.statics.findUser = function (email, password, callback) {
  let User = this;

  User.findOne({email}).then(user => { 
    if (!user) {
        return callback(true);
    }

    verifyPassword(password, user.password, (res) => {
      if (res) return callback(null, user);
      
      return callback(true);
    });
  });
};


module.exports = mongoose.model('User', UserSchema);
