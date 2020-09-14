const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hashPassword = require('./functions/hashPassword');
const verifyPassword = require('./functions/verifyPassword');

const CompanySchema = new Schema({
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
  company_name: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  campaigns: {
    type: Array,
    default: []
  },
  waiting_photos: {
    type: Array,
    default: []
  }
});

CompanySchema.pre('save', hashPassword);

CompanySchema.statics.findCompany = function (email, password, callback) {
  let Company = this;

  Company.findOne({email}).then(company => { 
    if (!company) {
        return callback(true);
    }

    verifyPassword(password, company.password, (res) => {
      if (res) return callback(null, company);
      
      return callback(true);
    });
  });
};


module.exports = mongoose.model('Company', CompanySchema);
