const express = require('express');
require('dotenv').config();

const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB, PORT } = require('./utils/config');

const appRouter = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(cors());
app.use(helmet());
mongoose.connect(DB);

app.use(express.json());

app.use(requestLogger);
app.use(limiter);

app.use(appRouter);
app.use(errorLogger);

app.use(errors()); // сборка JSON-формата
app.use(errorHandler); // централизолванная обработка ошибок

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});
