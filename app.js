/* eslint-disable linebreak-style */
/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi } = require('celebrate');
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
  console.log('falldown');
});
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/),
  }),
}), createUser);
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
