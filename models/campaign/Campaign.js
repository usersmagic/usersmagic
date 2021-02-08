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
  photo: {
    // Image of the campaign, an url to AWS database. (For old campaigns)
    type: String,
    required: true
  },
  description: {
    // Description of the campaign
    type: String,
    required: true
  },
  information: {
    // The information about the campaign
    type: String,
    required: true
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

CampaignSchema.statics.getCampaignById = function (id, callback) {
  // Find the campaign with the given id and return it, or an error it it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Campaign = this;

  Campaign.findById(mongoose.Types.ObjectId(id.toString()), (err, campaign) => {
    if (err || !campaign)
      return callback('document_not_found');

    getCampaign(campaign, (err, campaign) => {
      if (err) return callback(err);

      return callback(null, campaign);
    });
  });
};

module.exports = mongoose.model('Campaign', CampaignSchema);
