const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');

const { errors } = require('celebrate');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB, PORT } = require('./utils/config');



const appRouter = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
mongoose.connect(DB);
app.use(helmet());

app.use(cors({
  origin: 'https://ryzhep-movies.nomoredomainsmonster.ru', // Разрешаем доступ только с определенного домена
  methods: ['GET', 'POST','DELETE', 'PATCH' ], // Укажите методы, которые разрешены
  allowedHeaders: ['Content-Type', 'Authorization'], // Укажите разрешенные заголовки
  credentials: true, // Разрешение кросс-доменных запросов с передачей авторизационных данных
}));

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
