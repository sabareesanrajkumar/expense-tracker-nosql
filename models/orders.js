const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  paymentid: String,
  orderid: String,
  status: String,
});

module.exports = mongoose.model("Order", orderSchema);
