const Expenses = require("../models/expenses");
const Income = require("../models/income");
const Users = require("../models/users");
const Sequelize = require("sequelize");
const AWS = require("aws-sdk");
require("dotenv").config();

exports.downloadReport = async (req, res, next) => {
  const expensesReport = await req.user.getExpenses();

  const incomeReport = await req.user.getIncomes();
  const reportString =
    JSON.stringify(expensesReport) + JSON.stringify(incomeReport);
  const filename = `report${req.user.id}/${new Date()}.txt`;
  const fileURL = await uploadToS3(reportString, filename);
  console.log(fileURL);
  return res.status(200).json({ fileURL, success: true });

  async function uploadToS3(data, filename) {
    const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
    const IAM_USER_KEY = process.env.AWS_IAM_USER_ACCESS_KEY;
    const IAM_USER_SECRET = process.env.AWS_IAM_USER_SECRET_KEY;

    let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    });

    return new Promise((resolve, reject) => {
      const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: "public-read",
      };

      s3bucket.upload(params, (err, s3response) => {
        if (err) {
          console.error("Error during upload:", err);
          reject(err);
        } else {
          console.log("Upload successful");
          resolve(s3response.Location);
        }
      });
    });
  }
};
