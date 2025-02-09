const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const incomeSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  income: Number,
  description: String,
});

module.exports = mongoose.model("income", incomeSchema);
