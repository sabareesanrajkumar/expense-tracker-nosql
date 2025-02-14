const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const userRoutes = require('./routes/users');
const expenseRoutes = require('./routes/expenses');
// const purchaseRoutes = require('./routes/purchase');
// const premiumRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password');
const incomeRoutes = require('./routes/income');
// const downloadRoutes = require('./routes/download');

const User = require('./models/users');
const Expense = require('./models/expenses');
const Income = require('./models/income');
// const Order = require("./models/orders");
// const forgotPasswordRequest = require("./models/forgotpasswordRequests");

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);
app.use(cors());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.json());

app.use('/user', userRoutes);
app.use('/expenses', expenseRoutes);
// app.use('/purchase', purchaseRoutes);
// app.use('/premium', premiumRoutes);
app.use('/password', passwordRoutes);
app.use('/income', incomeRoutes);
// app.use('/download', downloadRoutes);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@expense-tracker.utikq.mongodb.net/?retryWrites=true&w=majority&appName=expense-tracker`
  )
  .then((client) => {
    console.log('mongoose connected');
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
