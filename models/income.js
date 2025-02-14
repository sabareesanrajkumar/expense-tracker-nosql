const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const incomeSchema = new Schema({
  income: Number,
  description: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Income', incomeSchema);
