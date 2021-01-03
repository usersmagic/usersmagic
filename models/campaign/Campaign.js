const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const getCampaign = require('./functions/getCampaign');

const Schema = mongoose.Schema;

const CampaignSchema = new Schema({
  name: {
    // Name of the campaign
    type: String,
    required: true
  },
  image: {
    // Image of the campaign, an url to AWS database
    type: String,
    required: true
  },
  description: {
    // Description of the campaign
    type: String,
    required: true
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
  price: {
    // The credit given per user who finished the campaign
    type: Number,
    required: true
  },
  is_free: {
    // If the campaign is free, different than 0 price
    type: Boolean,
    default: false
  },
  questions: {
    // Array of ids from Question model
    type: Array,
    required: true
  },
  countries: {
    // Filter for user's country, required at least one country
    type: Array,
    required: true
  },
  gender: {
    // Filter for user's gender: [erkek, kadın, both]
    type: String,
    required: true
  },
  min_birth_year: {
    // Filter for user's birth_year, the birth_year should be bigger than this field (younger)
    type: Number,
    required: true
  },
  max_birth_year: {
    // Filter for user's birth_year, the birth_year should be smaller than this field (older)
    type: Number,
    required: true
  },
  paused: {
    // Information that if a campaign is paused. If a campaign is paused the users cannot see it in /campaigns or /history pages
    // Do NOT delete a campaign, pause it instead
    type: Boolean,
    default: false
  }
});

CampaignSchema.statics.findCampaignsForUser = function (user, callback) {
  // Finds and returns the campaigns that the given user object can join, or returns an error if it exists

  if (!user._id || !user.gender || !user.birth_year || !Number.isInteger(user.birth_year) || !user.country)
    return callback('bad_request');

  user.campaigns = (user.campaigns && Array.isArray(user.campaigns) ? user.campaigns : []);

  const Campaign = this;

  Campaign.find({$and: [
    {_id: {$nin: user.campaigns}},
    {$or: [
      { gender: "both" },
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
      (time, next) => getCampaign(campaigns[time], (err, campaign) => next(err, campaign)),
      (err, campaigns) => {
        if (err) return callback(err);

        return callback(null, campaigns);
      }
    );
  });
}

CampaignSchema.statics.checkIfUserCanJoinCampaign = function (id, user, callback) {
  // Checks if the given user can join the campaign with the given id
  // Returns the campaign or an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Campaign = this;

  Campaign.findOne({$and: [
    { _id: mongoose.Types.ObjectId(id) },
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

    getCampaign(campaign, (err, campaign) => {
      if (err) return callback(err);

      return callback(null, campaign);
    });
  });
}

module.exports = mongoose.model('Campaign', CampaignSchema);
