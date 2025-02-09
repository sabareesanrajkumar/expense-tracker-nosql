const express = require("express");
const router = express.Router();

const purchaseController = require("../controllers/purchase");
const authenticationController = require("../middleware/auth");

router.get(
  "/premiummembership",
  authenticationController.authenticate,
  purchaseController.purchasePremium
);
router.post(
  "/updatetransactionstatus",
  authenticationController.authenticate,
  purchaseController.updateTransactionStatus
);

module.exports = router;
