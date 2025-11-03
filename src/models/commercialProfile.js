const mongoose = require('mongoose');
const { Schema } = mongoose;

// ----------------------
// COMMERCIAL PROFILE SCHEMA
// ----------------------
const commercialProfileSchema = new Schema({
  // LICENSE ASSIGNMENTS LINKED TO THIS PROFILE
  licenseAssignment: [{
    type: Schema.Types.ObjectId,
    ref: 'license_assignments',
    required: true,
    unique: true,
  }],

  // COMPANY INFORMATION
  companyName: { type: String, required: true, trim: true }, // NAME OF THE COMPANY
  identification: { type: String, required: true, trim: true }, // NIF / NIE / CIF / DNI
  contactEmail: { type: String, required: true, trim: true, lowercase: true }, // CONTACT EMAIL
  contactPhone: { type: String, required: true, trim: true }, // CONTACT PHONE
  website: { type: String, trim: true }, // COMPANY WEBSITE
  address: { type: String, trim: true }, // COMPANY ADDRESS
  postalCode: { type: String, trim: true }, // POSTAL CODE
  city: { type: String, trim: true }, // CITY
  province: { type: String, trim: true }, // PROVINCE
  country: {
    type: Schema.Types.ObjectId,
    ref: 'countries' // LINK TO COUNTRY COLLECTION
  },

  // GEOLOCATION
  location: {
    type: {
      type: String,
      enum: ['Point'], // GEOJSON TYPE
    },
    coordinates: {
      type: [Number], // [LONGITUDE, LATITUDE]
    },
  },

  // USER TYPE
  userType: { type: String, enum: ['cam', 'esp'], required: true }, // CAM || ESP

  // VERIFICATION AND VISIBILITY CONTROL
  isVerified: { type: Boolean, default: false }, // IS PROFILE VERIFIED
  verificationDate: { type: Date }, // DATE OF VERIFICATION
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'admins' }, // VERIFIED BY ADMIN

  // ADDITIONAL MARKETING INFORMATION
  description: { type: String, trim: true }, // COMPANY DESCRIPTION
  logo: { type: String, trim: true, default: 'https://via.placeholder.com/150' }, // COMPANY LOGO
  likes: { type: Number, default: 0 }, // NUMBER OF LIKES
  views: { type: Number, default: 0 }, // NUMBER OF VIEWS
  rating: { type: Number, min: 0, max: 5, default: 0 }, // RATING FROM 0 TO 5

  // PROFILE STATE
  isActive: { type: Boolean, default: true }, // IS PROFILE ACTIVE

}, {
  collection: 'commercial_profiles',
  timestamps: true, // CREATION AND UPDATE TIMESTAMPS
});

// CREATE 2DSPHERE INDEX FOR GEOLOCATION QUERIES
commercialProfileSchema.index({ location: '2dsphere' });

// ----------------------
// MODEL EXPORT
// ----------------------
const COMMERCIAL_PROFILE = mongoose.model('commercial_profile', commercialProfileSchema);
module.exports = COMMERCIAL_PROFILE;
