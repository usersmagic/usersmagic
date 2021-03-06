const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const checkTimezone = require('./functions/checkTimezone');
const getCountry = require('./functions/getCountry');
const getTimezones = require('./functions/getTimezones');

const CountrySchema = new Schema({
  name: {
    // Name of the country, in its original language
    type: String,
    required: true
  },
  alpha2_code: {
    // Alpha 2 Code of the country, required and should be unique
    type: String,
    unique: true,
    length: 2
  },
  cities: {
    // An array of cities, all lowercase. Each city should be unique
    type: Array,
    default: []
  },
  towns: {
    // An object showing the towns for each city, all lowercase
    type: Object,
    default: {}
  },
  phone_code: {
    // The phone code of the country without a plus sign on front
    type: Number,
    required: true
  },
  currency: {
    // The sign of the currency the country uses, default to €
    type: String,
    default: '€'
  },
  min_payment_amount: {
    // The minimum amount that the users in this country can withdraw from their accont
    type: Number,
    required: true
  },
  credit_per_user: {
    // The credit that should be given by Company per user, minimum one. Should be an Integer
    type: Number,
    required: true
  },
  completed: {
    // Field showing if the country if completed or not.
    // A developer should complete a Country, after adding if to translations folder and saving its default cities and towns
    type: Boolean,
    default: false
  }
});

CountrySchema.statics.getCountryById = function (data, callback) {
  // Finds and returns the country with the given id, does not delete the towns object. Returns an error if it exists

  if (!data || typeof data != 'object' || !data.id || !validator.isMongoId(data.id.toString()))
    return callback('bad_request');

  const Country = this;

  Country.findById(mongoose.Types.ObjectId(data.id.toString()), (err, country) => {
    if (err || !country) return callback('document_not_found');

    return callback(null, country);
  });
};

CountrySchema.statics.createCountry = function (data, callback) {
  // Create a country object and returns its id or an error if it exists

  if (
    !data ||
    !data.name || !data.name.length ||
    !data.alpha2_code || data.alpha2_code.length != 2 ||
    !data.phone_code || isNaN(parseInt(data.phone_code)) ||
    !data.currency || typeof data.currency != 'string' ||
    !data.min_payment_amount || isNaN(parseInt(data.min_payment_amount)) ||
    !data.credit_per_user || isNaN(parseInt(data.credit_per_user))
  )
    return callback('bad_request');

  const Country = this;

  const newCountryData = {
    name: data.name,
    alpha2_code: data.alpha2_code,
    phone_code: parseInt(data.phone_code),
    currency: data.currency,
    min_payment_amount: parseInt(data.min_payment_amount),
    credit_per_user: parseInt(data.credit_per_user)
  };

  const newCountry = new Country(newCountryData);

  newCountry.save((err, country) => {
    if (err && err.code == 11000)
      return callback('duplicated_unique_field');
    if (err)
      return callback('database_error');

    Country.collection
      .createIndex({
        alpha2_code: -1
      })
      .then(() => {
        Country.collection
          .createIndex({
            name: -1
          })
          .then(() => callback(null, country._id.toString()))
          .catch(err => callback('indexing_error'));
      })
      .catch(err => callback('indexing_error'));
  });
};


CountrySchema.statics.getCountriesByFilters = function (filters, callback) {
  // Finds and returns all countries sorted by their name

  const Country = this;

  Country
    .find({
      completed: true
    })
    .sort({ name: -1 })
    .then(countries => {
      async.timesSeries(
        countries.length,
        (time, next) => getCountry(countries[time], (err, country) => next(err, country)),
        (err, countries) => callback(err, countries)
      );
    })
    .catch(err => {
      return callback('database_error');
    });
};

CountrySchema.statics.getCountries = function (callback) {
  // Finds and returns all countries sorted by their name

  const Country = this;

  Country
    .find({
      completed: true
    })
    .sort({ name: 1 })
    .then(countries => {
      async.timesSeries(
        countries.length,
        (time, next) => getCountry(countries[time], (err, country) => next(err, country)),
        (err, countries) => callback(err, countries)
      );
    })
    .catch(err => {
      return callback('database_error');
    });
};

CountrySchema.statics.getAllCountries = function (callback) {
  // Finds and returns all countries sorted by their name

  const Country = this;

  Country
    .find({})
    .sort({ name: -1 })
    .then(countries => {
      async.timesSeries(
        countries.length,
        (time, next) => getCountry(countries[time], (err, country) => next(err, country)),
        (err, countries) => callback(err, countries)
      );
    })
    .catch(err => {
      return callback('database_error');
    });
};

CountrySchema.statics.getCountryWithAlpha2Code = function (code, callback) {
  // Finds and returns the country with the given alpha 2 code or an error if exists

  if (!code || code.length != 2)
    return callback('bad_request');

  const Country = this;

  Country.findOne({
    alpha2_code: code
  }, (err, country) => {
    if (err) return callback('database_error');

    getCountry(country, (err, country) => {
      if (err) return callback(err);

      return callback(null, country);
    });
  });
};

CountrySchema.statics.isTimezoneExists = function (timezone) {
  // Checks if the given timezone exists, returns true or false without a callback

  if (!timezone || !timezone.length)
    return false;

  return checkTimezone(timezone);
};

CountrySchema.statics.getTimezonesList = function (callback) {
  // Returns list of all timezones

  return callback(getTimezones());
};

CountrySchema.statics.pushCity = function (data, callback) {
  // Push the city into the cities array of the country with the given id, returns an error if it exists

  if (!data || typeof data != 'object' || !data.id || !validator.isMongoId(data.id.toString()) || !data.city || !data.city.length || data.city.length > 1000)
    return callback('bad_request');

  const Country = this;

  Country.findById(mongoose.Types.ObjectId(data.id.toString()), (err, country) => {
    if (err || !country) return callback('document_not_found');

    if (country.cities.includes(data.city))
      return callback('duplicated_unique_field');

    const towns = country.towns;
    towns[data.city] = [];

    Country.findByIdAndUpdate(mongoose.Types.ObjectId(data.id.toString()), {
      $push: {
        cities: data.city
      },
      $set: { towns }
    }, err => {
      if (err) return callback('database_error');

      return callback(null);
    });
  });
};

CountrySchema.statics.pullCity = function (data, callback) {
  // Pull the city from the cities array of the country with the given id, deletes all towns data, returns an error if it exists

  if (!data || typeof data != 'object' || !data.id || !validator.isMongoId(data.id.toString()) || !data.city || !data.city.length || data.city.length > 1000)
    return callback('bad_request');

  const Country = this;

  Country.findOne({
    _id: mongoose.Types.ObjectId(data.id.toString()),
    cities: data.city
  }, (err, country) => {
    if (err || !country)
      return callback('document_not_found');

    const towns = country.towns;
    delete towns[data.city];
  
    Country.findByIdAndUpdate(mongoose.Types.ObjectId(data.id.toString()), {
      $pull: {
        cities: data.city
      },
      $set: { towns }
    }, err => {
      if (err) return callback('database_error');
  
      return callback(null);
    });
  });
};

CountrySchema.statics.getTowns = function (data, callback) {
  // Finds the country with the given id, returns its town array for the given city or an error if it exists

  if (!data || typeof data != 'object' || !data.id || !validator.isMongoId(data.id.toString()) || !data.city)
    return callback('bad_request');

  const Country = this;

  Country.findById(mongoose.Types.ObjectId(data.id), (err, country) => {
    if (err || !country) return callback('document_not_found');

    return callback(null, (country.towns[data.city] && Array.isArray(country.towns[data.city]) ? country.towns[data.city] : []));
  });
};

CountrySchema.statics.validateCityAndTown = function (alpha2_code, data, callback) {
  // Validate the given city/town pair in the data using country alpha2code
  // Return true or false, showing the pair is valid or not, respectively

  if (!alpha2_code || alpha2_code.length != 2 || !data || typeof data != 'object' || !data.city || !data.town)
    return callback(false);

  const Country = this;

  Country.findOne({
    alpha2_code: alpha2_code.trim(),
    cities: data.city.trim(),
    ["towns." + data.city]: data.town.trim()
  }, (err, country) => {
    if (err || !country)
      return callback(false);

    return callback(true);
  });
};

module.exports = mongoose.model('Country', CountrySchema);
