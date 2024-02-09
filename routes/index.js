const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { validAuth, validUserData } = require('../middlewares/validator');
const NotFoundError = require('../errors/NotFoundError');


const {
  createUser, login, signOut
} = require('../controllers/users');

router.post('/signup', validUserData, createUser );
router.post('/signin', validAuth, login);

router.use(auth);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.post('/signout', signOut);

router.use('*', (req, res, next) => {
  next(
    new NotFoundError(
      'Страница не найдена. Проверьте правильность ввода URL и метод запроса',
    ),
  );
});

module.exports = router;