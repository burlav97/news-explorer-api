const jwt = require('jsonwebtoken');
const AuthError = require('../error/auth-err');
const { JWT_SECRET } = require('../config/prod.js');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.log(err);
    const error = new AuthError('Необходима авторизация');
    next(error);
  }
  req.user = payload;
  return next();
};
