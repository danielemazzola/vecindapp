const mongoose = require('mongoose');
const { Schema } = mongoose;

const communitySchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'users', default: [] }],
  camUserId: { type: Schema.Types.ObjectId, ref: 'cams', default: null },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  phone: { type: String, trim: true, required: true },
  address: { type: String, trim: true, required: true },
  postal_code: { type: String, trim: true, required: true },
  city: { type: String, trim: true, required: true },
  country: { type: String, trim: true, required: true },
  province: { type: String, trim: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  isActive: { type: Boolean, default: true },
  creatorAdminId: { type: Schema.Types.ObjectId, ref: 'admins', default: null },
  creatorCamId: { type: Schema.Types.ObjectId, ref: 'cams', default: null },
}, {
  collection: 'communities',
  timestamps: true,
});

communitySchema.index({ location: '2dsphere' });

const COMMUNITY_MODEL = mongoose.model('communities', communitySchema);
module.exports = COMMUNITY_MODEL;