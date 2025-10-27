const mongoose = require('mongoose');
const { Schema } = mongoose
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  name: { type: String, trim: true, required: true },
  lastname: { type: String, trim: true, required: true },
  phone: { type: String, trim: true, required: true },
  email: { type: String, unique: true, trim: true, lowercase: true, required: true },
  address: { type: String, trim: true },
  postal_code: { type: String, trim: true },
  city: { type: String, trim: true },
  country: { type: String, trim: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  },
  taxId: { type: String, trim: true }, // NIT / CIF / RUC
  password: { type: String, minlength: 6 },
  avatar: {
    type: String,
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDwmG52pVI5JZfn04j9gdtsd8pAGbqjjLswg&s'
  },
  roles: { type: [String], enum: ['user', 'admin'], default: ['user'] },
}, {
  collection: 'users',
  timestamps: true
});

userSchema.index({ location: '2dsphere' });

userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    this.password = bcrypt.hashSync(this.password, 8)
  }
  next();
})

const USER_MODEL = mongoose.model('users', userSchema);
module.exports = USER_MODEL;