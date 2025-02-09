const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  expense: Number,
  description: String,
});

module.exports = mongoose.model("expense", expenseSchema);

// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const Expenses = sequelize.define("expenses", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   expense: Sequelize.INTEGER,
//   description: Sequelize.STRING,
//   type: Sequelize.STRING,
// });

// module.exports = Expenses;
