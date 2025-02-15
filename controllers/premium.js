const Expenses = require('../models/expenses');
const Income = require('../models/income');
const Users = require('../models/users');
const moment = require('moment');

exports.getLeaderBoard = async (req, res, next) => {
  if (req.user) {
    const leaderboardResponse = await Users.aggregate([
      {
        $lookup: {
          from: 'Expense',
          localField: '_id',
          foreignField: 'userId',
          as: 'expenses',
        },
      },
      {
        $group: {
          _id: '$_id',
          userName: { $first: '$userName' },
          totalExpense: { $sum: '$totalExpense' },
        },
      },
      {
        $sort: { totalExpense: -1 },
      },
    ]);

    const formattedResponse = leaderboardResponse.map((record) => {
      return {
        userId: record._id,
        userName: record.userName,
        totalExpense: record.totalExpense,
      };
    });
    return res.status(200).json(formattedResponse);
  }
};

exports.getFileterdReport = async (req, res, next) => {
  const period = req.params.period;
  const userId = req.user._id;

  const now = moment.utc();

  let startDate;
  if (period === 'daily') {
    startDate = now.startOf('day');
  } else if (period === 'weekly') {
    startDate = now.startOf('week');
  } else if (period === 'monthly') {
    startDate = now.startOf('month');
  } else {
    return res.status(400).json({ message: 'Invalid period' });
  }

  let reportExpenses = await Expenses.find({
    userId: userId,
    createdAt: {
      $gte: startDate,
    },
  });

  let reportIncome = await Income.find({
    userId: userId,
    createdAt: {
      $gte: startDate,
    },
  });

  reportExpenses = formatDate(reportExpenses);
  reportIncome = formatDate(reportIncome);

  function formatDate(records) {
    return records.map((record) => {
      const doc = record._doc || record;
      return {
        ...doc,
        createdAt: new Date(record.createdAt).toLocaleDateString('en-GB'),
      };
    });
  }
  const filteredReportResponse = [...reportExpenses, ...reportIncome];
  return res.status(200).json(filteredReportResponse);
};
