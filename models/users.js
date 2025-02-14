const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passWord: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  isPremiumUser: {
    type: Boolean,
  },
  totalExpense: {
    type: Number,
  },
  totalIncome: {
    type: Number,
  },
  expenses: [{ type: Schema.Types.ObjectId, ref: 'Expense' }],
  income: [{ type: Schema.Types.ObjectId, ref: 'Income' }],
});

module.exports = mongoose.model('User', userSchema);
