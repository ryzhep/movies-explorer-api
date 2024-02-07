const router = require('express').Router();

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.post('/', createMovie);
router.get('/', getMovies);
router.delete('/:movieId', deleteMovie);

module.exports = router;