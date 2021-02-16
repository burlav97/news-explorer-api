require('dotenv').config();

const {
  PORT,
  MONGO_BD_URL,
  NODE_ENV,
  JWT_SECRET,
} = process.env;

const prod = NODE_ENV === 'production';
const port = (prod && PORT) ? PORT : '3000';
const jwtSecret = (prod && JWT_SECRET) ? JWT_SECRET : 'dev-secret';
const mongoUrl = (prod && MONGO_BD_URL) ? MONGO_BD_URL : 'mongodb://localhost:27017/newdb';

module.exports = {
  PORT: port,
  JWT_SECRET: jwtSecret,
  MONGO_BD_URL: mongoUrl,
};
