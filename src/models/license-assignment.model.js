const mongoose = require('mongoose')
const { Schema } = mongoose

// ----------------------
// LICENSE ASSIGNMENT SCHEMA
// ----------------------
const licenseAssignmentSchema = new Schema(
  {
    // REFERENCE TO LICENSE
    license: {
      type: Schema.Types.ObjectId,
      ref: 'licenses',
      required: true,
    },

    // ASSIGNMENT DATES
    startDate: {
      type: Date,
      default: Date.now, // START DATE OF LICENSE ASSIGNMENT
    },
    endDate: {
      type: Date,
      required: true, // END DATE OF LICENSE ASSIGNMENT
    },

    // LICENSE STATE
    isActive: {
      type: Boolean,
      default: true, // IS LICENSE ASSIGNMENT ACTIVE
    },

    // REMAINING BENEFICIARIES
    remainingBeneficiaries: {
      type: Number,
      default: 0, // NUMBER OF BENEFICIARIES LEFT
    },

    // USER AND BENEFICIARY INFORMATION
    user: {
      owner: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true, // OWNER OF THE LICENSE ASSIGNMENT
      },
      beneficiaryType: {
        type: String,
        required: true,
        enum: ['users', 'communities'], // TYPE OF BENEFICIARY
      },
      beneficiaries: [
        {
          type: Schema.Types.ObjectId,
          refPath: 'user.beneficiaryType', // REFERENCE TO USERS OR COMMUNITIES BASED ON beneficiaryType
        },
      ],
    },
  },
  {
    collection: 'license_assignments', // COLLECTION NAME IN MONGODB
    timestamps: true, // CREATION AND UPDATE TIMESTAMPS
  },
)

// ----------------------
// MODEL EXPORT
// ----------------------
const LICENSE_ASSIGNMENT = mongoose.model(
  'license_assignments',
  licenseAssignmentSchema,
)
module.exports = LICENSE_ASSIGNMENT
