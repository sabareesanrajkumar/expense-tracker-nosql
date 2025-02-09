const express = require("express");
const router = express.Router();

const downloadController = require("../controllers/download");
const userAuthentication = require("../middleware/auth");

router.get(
  "/downloadreport",
  userAuthentication.authenticate,
  downloadController.downloadReport
);

module.exports = router;
