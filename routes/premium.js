const express = require("express");
const router = express.Router();

const premiumController = require("../controllers/premium");
const userAuthentication = require("../middleware/auth");

router.get(
  "/leaderboard",
  userAuthentication.authenticate,
  premiumController.getLeaderBoard
);
router.get(
  "/filteredreport/:period",
  userAuthentication.authenticate,
  premiumController.getFileterdReport
);

module.exports = router;
