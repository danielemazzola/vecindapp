const mongoose = require('mongoose')

const countrySchema = new mongoose.Schema({
  code: { type: String, trim: true, required: true, unique: true, uppercase: true },
  country: { type: String, trim: true, required: true, unique: true, uppercase: true },
  creator: { type: mongoose.Types.ObjectId, ref: 'users' },
  userUpdate: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
},
  {
    timestamps: true,
    collection: 'countries',
  }
)

const COUNTRY_MODEL = mongoose.model('COUNTRY_MODEL', countrySchema)
module.exports = COUNTRY_MODEL