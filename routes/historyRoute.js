const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const userIndexGetController = require('../controllers/history/user/get');

router.get(
  '/user',
    isLoggedIn,
    userIndexGetController
);

module.exports = router;
