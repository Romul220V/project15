const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { getCards, delCardId, createCard } = require('../controllers/cards');

router.get('/cards', getCards);
router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    cardId: Joi.string().hex(),
  }),
}), delCardId);
router.post('/cards', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    link: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/),
    owner: Joi.string().hex(),
    likes: Joi.string().hex(),
    createdAt: Joi.date(),
  }),
}), createCard);
module.exports = router;
