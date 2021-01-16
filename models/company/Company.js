const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const getCompany = require('./functions/getCompany');
const hashPassword = require('./functions/hashPassword');
const verifyNewCompanyData = require('./functions/verifyNewCompanyData');
const verifyPassword = require('./functions/verifyPassword');

const CompanySchema = new Schema({
  email: {
    // The email of the account
    type: String,
    unique: true,
    minlength: 1,
    required: true
  },
  password: {
    // The password, saved hashed
    type: String,
    required: true,
    minlength: 6
  },
  country: {
    // Alpha 2 country code of the company
    type: String,
    default: null,
    length: 2
  },
  company_name: {
    // Name of the account company
    type: String,
    default: null,
    maxlenght: 1000
  },
  phone_number: {
    // Phone number of the company
    type: String,
    default: null
  },
  profile_photo: {
    // Profile photo of company
    type: String,
    default: '/res/images/default/company.png'
  },
  account_holder_name: {
    // Name of the account holder
    type: String,
    default: null,
    maxlenght: 1000
  },
  timezone: {
    // Timezone of the account
    type: String,
    default: null
  }
});

CompanySchema.pre('save', hashPassword);

CompanySchema.statics.findCompanyById = function (id, callback) {
  // Finds and returns the document with the given id, or an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Company = this;

  Company.findById(mongoose.Types.ObjectId(id.toString()), (err, company) => {
    if (err || !company) return callback('document_not_found');

    getCompany(company, (err, company) => {
      if (err) return callback(err);

      return callback(null, company);
    });
  });
}

module.exports = mongoose.model('Company', CompanySchema);
