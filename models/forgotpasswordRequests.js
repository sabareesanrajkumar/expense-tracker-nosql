// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const ForgotPasswordRequests = sequelize.define("forgotPasswordRequests", {
//   id: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     primaryKey: true,
//   },
//   userId: Sequelize.INTEGER,
//   isActive: Sequelize.BOOLEAN,
// });

// module.exports = ForgotPasswordRequests;

const mongoose = require("mongoose");

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
  "forgotpasswordrequest",
  forgotPasswordRequestSchema
);
