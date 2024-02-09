const router = require('express').Router();
const { validUpdateProfile } = require('../middlewares/validator');

const {
  getUser, updateUser,
} = require('../controllers/users');

router.get('/me', getUser);
router.patch('/me', validUpdateProfile, updateUser);

module.exports = router;
