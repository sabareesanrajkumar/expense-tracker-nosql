// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const Users = sequelize.define("users", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   userName: Sequelize.STRING,
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   passWord: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   phoneNumber: {
//     type: Sequelize.STRING,
//   },
//   isPremiumUser: {
//     type: Sequelize.BOOLEAN,
//   },
//   totalExpense: {
//     type: Sequelize.INTEGER,
//   },
//   totalIncome: {
//     type: Sequelize.INTEGER,
//   },
// });

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
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
});

module.exports = mongoose.model("User", userSchema);
