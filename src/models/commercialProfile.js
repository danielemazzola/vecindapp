const mongoose = require('mongoose');
const { Schema } = mongoose;

const commercialProfileSchema = new Schema({
  licenseAssignment: [{
    type: Schema.Types.ObjectId,
    ref: 'license_assignments',
    required: true,
    unique: true,
  }],
  companyName: { type: String, required: true, trim: true },
  identification: {
    type: String,
    required: true,
    trim: true
  }, // NIF / NIE / CIF / DNI
  contactEmail: { type: String, required: true, trim: true, lowercase: true },
  contactPhone: { type: String, required: true, trim: true },
  website: { type: String, trim: true },
  address: { type: String, trim: true },
  postalCode: { type: String, trim: true },
  city: { type: String, trim: true },
  province: { type: String, trim: true },
  country: { type: String, trim: true, default: 'España' },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  },

  // CAM || ESP
  userType: { type: String, enum: ['cam', 'esp'], required: true },

  // Control de verificación y visibilidad
  isVerified: { type: Boolean, default: false },
  verificationDate: { type: Date },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'admins' },

  // Aditional information Marketing
  description: { type: String, trim: true },
  logo: { type: String, trim: true, default: 'https://via.placeholder.com/150' },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  rating: { type: Number, min: 0, max: 5, default: 0 },

  // Profile state
  isActive: { type: Boolean, default: true },

}, {
  collection: 'commercial_profiles',
  timestamps: true,
});

commercialProfileSchema.index({ location: '2dsphere' });

const COMMERCIAL_PROFILE = mongoose.model('commercial_profile', commercialProfileSchema)
module.exports = COMMERCIAL_PROFILE
