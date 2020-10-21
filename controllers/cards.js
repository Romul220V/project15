const Card = require('../models/card');
const SmthnWrong = require('../errors/SmthnWrong');
const NotFoundError = require('../errors/NotFoundError');
const AuthDenied = require('../errors/AuthDenied');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => next(new Error()));
};

module.exports.delCardId = (req, res, next) => {
  const owner = req.user._id;
  Card.findOne({ _id: req.params.cardId, owner })
    .orFail(() => new Error('Not Found'))
    .then((card) => {
      if (owner !== card.owner) {
        return Promise.reject(new Error('Denied'));
      }
      return Card.findOneAndRemove({ _id: req.params.cardId });
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new SmthnWrong('Нет пользователя с таким id'));
      } else if (err.message === 'Not Found') {
        next(new NotFoundError('Объект не найден'));
      } else if (err.message === 'Denied') {
        next(new AuthDenied('у вас нет прав'));
      } else next(new Error());
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new SmthnWrong('Переданы некорректные данные'));
      } else {
        next(new NotFoundError('Ошибка сервера'));
      }
    });
};
