/* eslint-disable linebreak-style */
/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const cards = require('./routes/cards');
const users = require('./routes/users');
const errorpage = require('./routes/404');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const ErrM = require('./middlewares/ErrMiddleware');
const { requestLogger, errorLogger } = require('./middlewares/ReqLog');

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/', users);
app.use('/', cards);
app.use('/', errorpage);
app.use(errorLogger);
app.use(errors());
app.use(ErrM);
app.listen(PORT, () => {
  console.log('Ссылка на сервер:');
  console.log(BASE_PATH);
});
