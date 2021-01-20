require('dotenv').config();
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRoutes = require('./users.js');
const artRoutes = require('./articles.js');
const auth = require('../middlewares/auth');
const NotFoundError = require('../error/not-found-err');
const {
  login,
  postUser,
} = require('../controllers/users.js');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), postUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.use(auth);
router.use('/users', userRoutes);
router.use('/aticles', artRoutes);

router.use('*', () => { throw new NotFoundError('Запрашиваемый ресурс не найден'); });

module.exports = router;
