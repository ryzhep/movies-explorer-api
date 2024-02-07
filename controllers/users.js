const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { CastError, ValidationError } = require('mongoose').Error;
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
//const UnauthorizedError = require('../errors/UnauthorizedError');

const { CREATED_201 } = require('../utils/constants');

const NotError= 200;

// создает пользователя -  работает
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
          if (err.name === 'ValidationError') {
            return next(new BadRequestError('Ошибка валидации'));
          }
          return next(err);
        });
    })
    .catch(next);
};

//возвращает информацию о пользователе GET /users/me - не работает
const getUser = (req, res, next) => {
  const { userId } = req.params;

  return User.findById(userId)
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
// обновляет информацию о юзере  - не работает
const updateUser = (req, res, next) => {
  const owner = req.user._id;
  return User.findByIdAndUpdate(
    owner,
    { name: req.body.name },
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
      } else {
        next(err);
      }
    });
};
// ручка POST /signin возвращает JWT - работает
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError('Неправильные почта или пароль'),
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError('Неправильные почта или пароль'),
          );
        }
        console.log(jwt)
        return res.status(200).send({
          message: 'Успешно авторизован',
          token: jwt.sign({ _id: user._id }, 'super-strong-secret', {
            expiresIn: '7d',
          }),
        });
      });
    })
    .catch(() => next(new UnauthorizedError('ошибка')))
    .catch(next);
};

module.exports = {
  getUser, updateUser,createUser,login
};