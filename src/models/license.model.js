const mongoose = require('mongoose');
const { Schema } = mongoose;

// ----------------------
// LICENSE SCHEMA
// ----------------------
const licenseSchema = new Schema({
  // PRODUCT NAME
  productName: { 
    type: String, 
    required: true, 
    trim: true 
  },

  // UNIQUE PRODUCT KEY
  productKey: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },

  // LICENSE DESCRIPTION
  description: { 
    type: String, 
    required: true, 
    trim: true 
  },

  // USER TYPE (CAM || ESP)
  userType: { 
    type: String, 
    enum: ['cam', 'esp'], 
    required: true 
  },

  // LICENSE PRICE
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },

  // LICENSE LIMITS
  limits: {
    maxCommunities: { type: Number, default: 0 }, // MAX NUMBER OF COMMUNITIES (CAM)
    maxAdmins: { type: Number, default: 0 },      // MAX NUMBER OF ADMINS (ESP)
  },

  // LICENSE STATE
  isActive: { type: Boolean, default: true }, // IS LICENSE ACTIVE

  // LICENSE DURATION
  durationDays: { type: Number, required: true, default: 30 }, // VALIDITY IN DAYS

  // CREATOR ADMIN
  creatorAdmin: { type: Schema.Types.ObjectId, ref: 'admins', required: true }, // ADMIN WHO CREATED LICENSE

  // UPDATE LOG
  userUpdate: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // USER WHO MADE THE UPDATE
        required: true,
      },
      updatedAt: {
        type: Date,
        default: Date.now, // TIMESTAMP OF UPDATE
      },
    },
  ],
}, 
{
  collection: 'licenses', // COLLECTION NAME IN MONGODB
  timestamps: true,       // CREATION AND UPDATE TIMESTAMPS
});

// ----------------------
// MODEL EXPORT
// ----------------------
const LICENSE_MODEL = mongoose.model('licenses', licenseSchema);
module.exports = LICENSE_MODEL;
