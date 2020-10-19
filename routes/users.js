/* eslint-disable linebreak-style */
const router = require('express').Router();
const { getUsers, getUsersId } = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUsersId);
module.exports = router;
