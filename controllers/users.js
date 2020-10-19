const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const SmthnWrong = require('../errors/SmthnWrong');
const NotFoundError = require('../errors/NotFoundError');

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return User.findOne({ email });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res
        .cookie('jwt', token, { httpOnly: true })
        .status(200).send({ message: 'logged in' });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUsersId = (req, res, next) => {
  User.find({ _id: req.params.userId })
    .orFail(() => new Error('Not Found'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new SmthnWrong('Нет пользователя с таким id'));
      } else if (err.message === 'Not Found') {
        next(new NotFoundError('Объект не найден'));
      } else { next(new Error()); }
    });
};
// eslint-disable-next-line consistent-return
module.exports.createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  // eslint-disable-next-line no-useless-escape
  const newpass = password.replace(/\s/g, '');
  if (newpass.length === 0) {
    return res.status(400).send({ message: 'Переданы некорректные данные' });
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then(() => res.send({ // destructur
      data: {
        email, name, about, avatar,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'MongoError' && err.code === 11000) { res.status(409).send({ message: 'Данный почтовый ящик уже зарегистрирован' }); } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};
