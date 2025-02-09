const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Expenses = sequelize.define("expenses", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  expense: Sequelize.INTEGER,
  description: Sequelize.STRING,
  type: Sequelize.STRING,
});

module.exports = Expenses;
