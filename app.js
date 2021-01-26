require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const limiter = require('./config/limiter.js');
const routes = require('./routes/index.js');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORT, MONGO_BD_URL } = require('./config/prod.js');

const app = express();
app.use(cors());

app.use(limiter);

mongoose.connect(MONGO_BD_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(helmet());
// app.use('/', limiter);
app.use('/', routes);

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening server ${PORT}`);
});
