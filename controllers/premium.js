const Expenses = require("../models/expenses");
const Income = require("../models/income");
const Users = require("../models/users");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const moment = require("moment");

exports.getLeaderBoard = async (req, res, next) => {
  if (req.user) {
    const leaderboardResponse = await Expenses.findAll({
      attributes: ["userId"],
      include: [
        {
          model: Users,
          attributes: ["userName", "totalExpense"],
        },
      ],
      group: ["userId"],
      order: [[Sequelize.literal("totalExpense"), "DESC"]],
    });

    const formattedResponse = leaderboardResponse.map((record) => {
      return {
        userId: record.userId,
        userName: record.user?.dataValues.userName,
        totalExpense: record.user?.dataValues.totalExpense,
      };
    });
    return res.status(200).json(formattedResponse);
  }
};

exports.getFileterdReport = async (req, res, next) => {
  const period = req.params.period;
  const userId = req.user.id;

  const now = moment.utc();

  let startDate;
  if (period === "daily") {
    startDate = now.startOf("day");
  } else if (period === "weekly") {
    startDate = now.startOf("week");
  } else if (period === "monthly") {
    startDate = now.startOf("month");
  } else {
    return res.status(400).json({ message: "Invalid period" });
  }

  const reportExpenses = await Expenses.findAll({
    where: {
      userId: userId,
      createdAt: {
        [Op.gte]: startDate.toDate(),
      },
    },
  });

  const reportIncome = await Income.findAll({
    where: {
      userId: userId,
      createdAt: {
        [Op.gte]: startDate.toDate(),
      },
    },
  });

  formatDate(reportExpenses);
  formatDate(reportIncome);

  async function formatDate(records) {
    await records.forEach((record) => {
      const date = record.dataValues.updatedAt;
      const dateStr = new Date(date);
      return `${dateStr.getDate()}-${dateStr.getMonth()}-${dateStr.getFullYear()}`;
    });
  }
  const filteredReportResponse = [...reportExpenses, ...reportIncome];

  return res.status(200).json(filteredReportResponse);
};
