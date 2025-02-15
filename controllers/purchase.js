const Razorpay = require('razorpay');
const Order = require('../models/orders');
const Users = require('../models/users');
require('dotenv').config();

exports.purchasePremium = async (req, res, next) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amountInPaise = 25 * 100;
    rzp.orders.create(
      { amount: amountInPaise, currency: 'INR' },
      async (err, data) => {
        var order = data;
        if (err) {
          throw new Error(JSON.stringify(err));
        }
        const newOrder = new Order({
          userId: req.user._id,
          orderId: order.id,
          status: 'PENDING',
        });
        await newOrder
          .save()
          .then(() => {
            return res.status(201).json({ order, key_id: rzp.key_id });
          })
          .catch((err) => {
            throw new Error(err);
          });
      }
    );
  } catch (err) {
    console.log(err);
    return res
      .status(403)
      .json({ success: false, message: 'something went wrong', error: err });
  }
};

exports.updateTransactionStatus = async (req, res, next) => {
  try {
    const { payment_id, order_id, status } = req.body;
    const order = await Order.findOne({ orderId: order_id });
    await Order.findByIdAndUpdate(order._id, {
      paymentId: payment_id,
      status: status,
    });

    if (status == 'SUCCESSFUL') {
      await Users.findByIdAndUpdate(req.user._id, { isPremiumUser: true });
      return res
        .status(202)
        .json({ success: true, message: 'transaction successful' });
    } else {
      return res
        .status(202)
        .json({ success: true, message: 'transaction failed' });
    }
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: 'something went wrong', error: err });
  }
};
