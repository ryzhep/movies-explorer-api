const router = require('express').Router();
const { validMovieInfo, validMovieId } = require('../middlewares/validator');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.post('/', validMovieInfo, createMovie);
router.get('/', getMovies);
router.delete('/:movieId', validMovieId, deleteMovie);

module.exports = router;
