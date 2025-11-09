const mongoose = require('mongoose')

// ----------------------
// COUNTRY SCHEMA
// ----------------------
const countrySchema = new mongoose.Schema(
  {
    // COUNTRY CODE
    code: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      uppercase: true, // STORED IN UPPERCASE
    },

    // COUNTRY NAME
    country: {
      type: String,
      trim: true,
      required: true,
      uppercase: true, // STORED IN UPPERCASE
    },

    // CREATOR OF THE COUNTRY ENTRY
    creator: {
      type: mongoose.Types.ObjectId,
      ref: 'users', // REFERENCE TO USER WHO CREATED THIS ENTRY
    },

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
    timestamps: true, // CREATION AND UPDATE TIMESTAMPS
    collection: 'countries', // COLLECTION NAME IN MONGODB
  },
)

// ----------------------
// MODEL EXPORT
// ----------------------
const COUNTRY_MODEL = mongoose.model('COUNTRY_MODEL', countrySchema)
module.exports = COUNTRY_MODEL
