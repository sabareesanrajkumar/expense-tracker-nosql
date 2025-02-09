const express = require("express");
const router = express.Router();

const incomeController = require("../controllers/income");
const userAuthentication = require("../middleware/auth");

router.post(
  "/addincome",
  userAuthentication.authenticate,
  incomeController.addIncome
);
router.get(
  "/getincome",
  userAuthentication.authenticate,
  incomeController.getIncome
);
router.delete(
  "/delete/:incomeId",
  userAuthentication.authenticate,
  incomeController.deleteIncome
);

module.exports = router;
