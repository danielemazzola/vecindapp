const mongoose = require('mongoose');
const { Schema } = mongoose;

const licenseAssignmentSchema = new Schema({
  license: { type: Schema.Types.ObjectId, ref: 'licenses', required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  remainingBeneficiaries: { type: Number, default: 0 },
  user: {
    owner: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    beneficiaryType: {
      type: String,
      required: true,
      enum: ['users', 'communities']
    },
    beneficiaries: [{
      type: Schema.Types.ObjectId,
      refPath: 'user.beneficiaryType'
    }]
  },
}, {
  collection: 'license_assignments',
  timestamps: true,
});

const LICENSE_ASSIGNMENT = mongoose.model('license_assignments', licenseAssignmentSchema)
module.exports = LICENSE_ASSIGNMENT