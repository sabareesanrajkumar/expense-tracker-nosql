const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Income = sequelize.define("income", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  income: Sequelize.INTEGER,
  description: Sequelize.STRING,
});

module.exports = Income;
