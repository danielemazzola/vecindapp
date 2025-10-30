const mongoose = require('mongoose');
const { Schema } = mongoose;

const licenseAssignmentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  license: { type: Schema.Types.ObjectId, ref: 'licenses', required: true },
  startDate: { type: Date, default: Date.now },
  camType: {
    cam: { type: Boolean, default: null },
    beneficiaries: [
      { type: Schema.Types.ObjectId, ref: 'communities', required: true }
    ]
  },

  espType: { type: Boolean, default: null },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
  remainingBeneficiaries: { type: Number, default: 0 },
}, {
  collection: 'license_assignments',
  timestamps: true,
});

const LICENSE_ASSIGMENT = mongoose.model('license_assignments', licenseAssignmentSchema)
module.exports = LICENSE_ASSIGMENT