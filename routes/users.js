/* eslint-disable linebreak-style */
const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { getUsers, getUsersId } = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex(),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    userId: Joi.string().hex(),
  }),
}), getUsersId);
module.exports = router;
