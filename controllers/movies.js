// const { CastError, validdationError } = require('mongoose').Error;
const Movies = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const { CREATED_201 } = require('../utils/constants');

const OK = 200;

// создаёт фильм с переданными в теле POST /movies
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  const addMovie = new Movies({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  });

  addMovie.save()
    .then((filmSave) => {
      res.status(CREATED_201).send(filmSave);
    })
    .catch((error) => {
      next(error);
    });
};

// возвращает сохраненные фильмы GET /movies
const getMovies = (req, res, next) => {
  Movies.find({ owner: req.user._id })
    .then((movies) => res.status(OK).send(movies))
    .catch((error) => {
      next(error);
    });
};

// удаление фильма - DELETE /movies/_id
const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movies.findById(movieId)
    .then((film) => {
      if (!film) {
        throw new NotFoundError('Такой карточки не существует');
      }
      if (!film.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Нельзя удалить чужой фильм'));
      }
      return film.deleteOne()
        .then(() => res.send(film));
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Некорректный ID'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
