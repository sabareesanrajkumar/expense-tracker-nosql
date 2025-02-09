const express = require("express");
const router = express.Router();

const expensesController = require("../controllers/expenses");
const userAuthentication = require("../middleware/auth");

router.post(
  "/addexpense",
  userAuthentication.authenticate,
  expensesController.addExpense
);
router.get(
  "/getexpenses",
  userAuthentication.authenticate,
  expensesController.getExpenses
);

router.delete(
  "/delete/:expenseId",
  userAuthentication.authenticate,
  expensesController.deleteExpense
);
module.exports = router;
