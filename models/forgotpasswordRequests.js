const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const forgotPasswordRequestSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  userId: Number,
  isActive: Boolean,
});

module.exports = mongoose.model(
  'forgotpasswordrequest',
  forgotPasswordRequestSchema
);
