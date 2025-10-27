const mongoose = require('mongoose');
const { Schema } = mongoose;

const surveySchema = new Schema({
  communityId: { type: Schema.Types.ObjectId, ref: 'communities', required: true },
  camCreated: { type: Schema.Types.ObjectId, ref: 'cams', default: null },
  userCreated: { type: Schema.Types.ObjectId, ref: 'users', default: null },
  title: { type: String, required: true },
  description: { type: String },
  startedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  isCompleted: { type: Boolean, default: false },
  votes: [{
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    choice: { type: String, enum: ['yes', 'no', 'abstain'] }
  }]
}, {
  timestamps: true, collection: 'surveys'
});

const SURVEY_MODEL = mongoose.model('community_surveys', surveySchema);
module.exports = SURVEY_MODEL;