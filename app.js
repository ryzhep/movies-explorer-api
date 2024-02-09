const express = require('express');
require('dotenv').config();

const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const appRouter = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');
app.use(express.json());

app.use(requestLogger);

app.use(appRouter);
app.use(errorLogger);

app.use(errors()); // сборка JSON-формата
app.use(errorHandler); // централизолванная обработка ошибок

const port = 3000;
app.listen(port, () => {
  console.log('Server is running on port 3000');
});
