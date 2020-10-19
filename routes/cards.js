const router = require('express').Router();
const { getCards, delCardId, createCard } = require('../controllers/cards');

router.get('/cards', getCards);
router.delete('/cards/:cardId', delCardId);
router.post('/cards', createCard);
module.exports = router;
