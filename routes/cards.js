const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { getCards, delCardId, createCard } = require('../controllers/cards');

router.get('/cards', getCards);
router.delete('/cards/:cardId', delCardId);
router.post('/cards', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().url(),
    owner: Joi.number().required(),
    likes: Joi.number(),
    createdAt: Joi.date(),
  }),
}), createCard);
module.exports = router;
