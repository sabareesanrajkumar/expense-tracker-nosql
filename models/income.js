const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const incomeSchema = new Schema({
  income: Number,
  description: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: {
    type: Date,
    default: () => new Date(Date.now() + 5.5 * 60 * 60 * 1000),
  },
});

module.exports = mongoose.model('Income', incomeSchema);
