const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

router.get('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});
module.exports = router;
