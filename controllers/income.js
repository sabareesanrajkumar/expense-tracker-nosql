const Income = require('../models/income');
const Users = require('../models/users');
const mongoose = require('mongoose');

exports.addIncome = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const income = new Income({
      ...req.body,
      userId: req.user._id,
    });
    await income.save({ session });

    await Users.findByIdAndUpdate(
      req.user._id,
      {
        $inc: {
          totalIncome: req.body.income,
        },
      },
      { session }
    );
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ success: true, message: 'income added' });
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json({ success: false, message: 'failed to add income' });
  }
};

exports.getIncome = async (req, res, next) => {
  await Income.find({ userId: req.user._id })
    .then((income) => {
      if (income) {
        return res.status(200).json(income);
      }
      return res.status(200).json();
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: 'sometihng went wrong' });
    });
};

exports.deleteIncome = async (req, res, next) => {
  const incomeId = mongoose.Types.ObjectId.createFromHexString(
    req.params.incomeId
  );
  const userId = req.user._id;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const oldIncome = await Income.findOne({
      _id: incomeId,
    });

    await Users.findByIdAndUpdate(
      req.user._id,
      {
        $inc: {
          totalIncome: -oldIncome.income,
        },
      },
      { session }
    );

    const deletedIncome = await Income.findByIdAndDelete(incomeId, {
      session,
    });

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ success: true, message: 'income deleted' });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);

    res
      .status(500)
      .json({ success: false, message: "couldn't deleted income" });
  }
};
