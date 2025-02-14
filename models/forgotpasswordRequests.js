const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const forgotPasswordRequestSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: Boolean,
});

module.exports = mongoose.model(
  'ForgotPasswordRequest',
  forgotPasswordRequestSchema
);
