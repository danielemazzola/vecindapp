const mongoose = require('mongoose');
const { Schema } = mongoose

const licenseSchema = new Schema({
  productName: { type: String, required: true, trim: true },
  productKey: { type: String, required: true, unique: true, trim: true },
  details: {
    description: { type: String, required: true, trim: true },
    benefits: { type: [String], default: [], required: true }
  },
  userType: { type: String, enum: ['cam', 'esp'], required: true },
  price: { type: Number, required: true, min: 0 },
  maxBeneficiaries: { type: Number },
  isActive: { type: Boolean, default: true },
  durationDays: { type: Number, required: true, default: 30 },
  creatorAdmin: { type: Schema.Types.ObjectId, ref: 'admins', required: true },
}, {
  collection: 'licenses',
  timestamps: true,
});

const LICENSE_MODEL = mongoose.model('licenses', licenseSchema);

module.exports = LICENSE_MODEL;