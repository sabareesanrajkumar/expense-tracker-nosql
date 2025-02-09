const Income = require("../models/income");
const Users = require("../models/users");
const Sequelize = require("../util/database");

exports.addIncome = async (req, res, next) => {
  const t = await Sequelize.transaction();
  try {
    await Income.create(
      {
        ...req.body,
        userId: req.user.id,
      },
      { transaction: t }
    );
    let newTotalIncome = +req.user.totalIncome + +req.body.income;

    await req.user.update(
      {
        totalIncome: newTotalIncome,
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(200).json({ success: true, message: "income added" });
  } catch (err) {
    await t.rollback();
    return res
      .status(500)
      .json({ success: false, message: "failed to add income" });
  }
};

exports.getIncome = async (req, res, next) => {
  await Income.findAll({ where: { userId: req.user.id } })
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
        .json({ success: false, message: "sometihng went wrong" });
    });
};

exports.deleteIncome = async (req, res, next) => {
  const incomeId = req.params.incomeId;
  const userId = req.user.id;
  const t = await Sequelize.transaction();

  try {
    const oldIncome = await Income.findOne({
      where: { id: incomeId, userId: userId },
    });

    await Users.update(
      {
        totalIncome: Sequelize.literal(`totalIncome - ${oldIncome.income}`),
      },
      { where: { id: userId }, transaction: t }
    );
    await Income.destroy({
      where: { id: incomeId, userId: userId },
      transaction: t,
    });

    await t.commit();
    res.status(200).json({ success: true, message: "income deleted" });
  } catch (err) {
    await t.rollback();

    res
      .status(500)
      .json({ success: false, message: "couldn't deleted income" });
  }
};
