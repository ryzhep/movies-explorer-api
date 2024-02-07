const express = require("express");
require("dotenv").config();
const { errors } = require('celebrate');
const mongoose = require("mongoose");

const appRouter = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/bitfilmsdb");
app.use(express.json());

// app.use((req, res, next) => {
//   req.user = {
//     _id: "65957b01791a4f2e0e926c84",
//   };
//   next();
// });
app.use(appRouter);
app.use(errorHandler);
app.use(errors());

const port = 3000;
app.listen(port, () => {
  console.log("Server is running on port 3000");
});
