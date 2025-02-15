const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  paymentId: String,
  orderId: String,
  status: String,
});

module.exports = mongoose.model('Order', orderSchema);
