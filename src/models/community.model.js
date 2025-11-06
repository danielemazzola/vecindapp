const mongoose = require('mongoose');
const { Schema } = mongoose;

// ----------------------
// COMMUNITY SCHEMA
// ----------------------
const communitySchema = new Schema({
  // COMMUNITY INFORMATION
  name: { type: String, required: true, trim: true }, // COMMUNITY NAME
  description: { type: String, trim: true, required: true }, // COMMUNITY DESCRIPTION
  email: { type: String, required: true, unique: true, trim: true, lowercase: true }, // CONTACT EMAIL
  phone: { type: String, trim: true, required: true }, // CONTACT PHONE
  address: { type: String, trim: true, required: true }, // COMMUNITY ADDRESS
  postal_code: { type: String, trim: true, required: true }, // POSTAL CODE
  city: { type: String, trim: true, required: true }, // CITY
  province: { type: String, trim: true }, // PROVINCE
  country: { type: String, trim: true, required: true }, // COUNTRY

  // MEMBERSHIP (IMPROVED STRUCTURE FOR MANAGING USER STATES)
  members: [
    {
      // USER WHO IS PART OF THE COMMUNITY (REFERENCE TO USERS COLLECTION)
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
      },

      // STATUS OF THE USER IN THE COMMUNITY
      // - "pending": USER REQUESTED TO JOIN BUT NOT YET APPROVED
      // - "active": USER IS ACCEPTED AS A MEMBER
      // - "rejected": USER REQUEST WAS REJECTED
      // ADDING OR CHANGING STATES LATER IS EASY (JUST ADD NEW VALUES TO ENUM)
      status: {
        type: String,
        enum: ['active', 'pending', 'rejected'],
        default: 'pending',
        required: true
      },

      // LAST DATE WHEN THIS USER'S MEMBERSHIP STATUS WAS UPDATED
      // USEFUL FOR TRACKING MODERATION ACTIONS, HISTORY AND AUDIT TRAILS
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  // GEOLOCATION
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true, // GEOJSON TYPE
    },
    coordinates: {
      type: [Number], // [LONGITUDE, LATITUDE]
      required: true,
    },
  },

  // PROFILE UPDATES LOG
  userUpdate: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true, // USER WHO MADE THE UPDATE
      },
      updatedAt: {
        type: Date,
        default: Date.now, // TIMESTAMP OF UPDATE
      },
    },
  ],

  // PROFILE STATE
  isActive: { type: Boolean, default: true }, // IS COMMUNITY ACTIVE

  // CREATOR
  creatorId: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // USER WHO CREATED THE COMMUNITY
}, {
  collection: 'communities',
  timestamps: true, // CREATION AND UPDATE TIMESTAMPS
});

// CREATE 2DSPHERE INDEX FOR GEOLOCATION QUERIES
communitySchema.index({ location: '2dsphere' });

// ----------------------
// MODEL EXPORT
// ----------------------
const COMMUNITY_MODEL = mongoose.model('communities', communitySchema);
module.exports = COMMUNITY_MODEL;
