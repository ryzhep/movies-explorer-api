const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { CastError, ValidationError } = require('mongoose').Error;

const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { CREATED_201 } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const OK = 200;

// создаёт пользователя с переданными в теле email, password и name POST /signup
const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then(() => res.status(CREATED_201).json({
          name,
          email,
        }))
        .catch((err) => {
          if (err.code === 11000) {
            return next(new ConflictError('Такой email уже существует')); // 409
          }
          if (err.name === 'validdationError') {
            return next(new BadRequestError('Ошибка валидации'));
          }
          return next(err);
        });
    })
    .catch(next);
};

// возвращает информацию о пользователе GET /users/me
const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Некорректный id пользователя'));
      } else {
        next(err);
      }
    });
};

// обновляет информацию о юзере  PATCH /users/me
const updateUser = (req, res, next) => {
  const owner = req.user._id;
  return User.findByIdAndUpdate(
    owner,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(', ');
        next(new BadRequestError(`Некорректные данные: ${errorMessage}`));
      } else if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует!'));
      } else {
        next(err);
      }
    });
};
// ручка  POST /signin возвращает JWT - работает
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          next(new UnauthorizedError('Неправильные почта или пароль'));
        }

        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

        return res.status(OK).send({
          message: 'Успешно авторизован',
          token,
        });
      });
    })
    .catch(next);
};

module.exports = {
  getUser, updateUser, createUser, login,
};
