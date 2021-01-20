const router = require('express').Router();
// const { celebrate, Joi } = require('celebrate');
const {
  getInfo,
} = require('../controllers/users.js');

router.get('/me', getInfo);

module.exports = router;
