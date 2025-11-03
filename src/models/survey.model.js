const mongoose = require('mongoose');
const { Schema } = mongoose;

// ----------------------
// SURVEY SCHEMA
// ----------------------
const surveySchema = new Schema({
  // REFERENCE TO COMMUNITY
  communityId: {
    type: Schema.Types.ObjectId,
    ref: 'communities',
    required: true // COMMUNITY WHERE SURVEY BELONGS
  },

  // SURVEY CREATOR
  camCreated: {
    type: Schema.Types.ObjectId,
    ref: 'cams',
    default: null // CREATED BY CAM (OPTIONAL)
  },
  userCreated: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    default: null // CREATED BY USER (OPTIONAL)
  },

  // SURVEY INFORMATION
  title: { type: String, required: true }, // SURVEY TITLE
  description: { type: String },           // SURVEY DESCRIPTION

  // SURVEY DATES
  startedAt: { type: Date, default: Date.now }, // START DATE OF SURVEY
  expiresAt: { type: Date },                    // EXPIRATION DATE OF SURVEY

  // SURVEY STATUS
  isCompleted: { type: Boolean, default: false }, // IS SURVEY COMPLETED

  // SURVEY VOTES
  votes: [{
    userId: { type: Schema.Types.ObjectId, ref: 'users' }, // USER WHO VOTED
    choice: { type: String, enum: ['yes', 'no', 'abstain'] } // USER CHOICE
  }]
},
  {
    collection: 'surveys', // COLLECTION NAME IN MONGODB
    timestamps: true       // CREATION AND UPDATE TIMESTAMPS
  });

// ----------------------
// MODEL EXPORT
// ----------------------
const SURVEY_MODEL = mongoose.model('community_surveys', surveySchema);
module.exports = SURVEY_MODEL;
