const Expense = require('../models/expenses');
const Users = require('../models/users');
const mongoose = require('mongoose');

exports.addExpense = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const expense = new Expense({
      ...req.body,
      userId: req.user._id,
    });
    await expense.save({ session });

    await Users.findByIdAndUpdate(
      req.user._id,
      {
        $inc: {
          totalExpense: req.body.expense,
        },
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ success: true, message: 'expense created' });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      success: false,
      message: 'failed to store expense in database' + err.message,
    });
  }
};

exports.getExpenses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const count = await Expense.countDocuments({ userId: req.user._id });
    const expenses = await Expense.find({ userId: req.user._id })
      .limit(limit)
      .skip(offset);

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      expenses,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: 'Something went wrong', error: err });
  }
};

exports.deleteExpense = async (req, res, next) => {
  const expenseId = mongoose.Types.ObjectId.createFromHexString(
    req.params.expenseId
  );
  const userId = req.user._id;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const oldExpense = await Expense.findOne({
      _id: expenseId,
    });

    await Users.findByIdAndUpdate(
      req.user._id,
      {
        $inc: {
          totalExpense: -oldExpense.expense,
        },
      },
      { session }
    );

    const deletedExpense = await Expense.findByIdAndDelete(expenseId, {
      session,
    });
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ success: true, message: 'expense deleted' });
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ success: false, message: "couldn't deleted" });
  }
};
