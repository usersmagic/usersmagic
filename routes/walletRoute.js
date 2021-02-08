const express = require('express');
const router = express.Router();

const isComplete = require('../middleware/isComplete');
const isLoggedIn = require('../middleware/isLoggedIn');

const indexGetController = require('../controllers/wallet/index/get');

const numberPostController = require('../controllers/wallet/number/post');

router.get(
  '/',
    isLoggedIn,
    isComplete,
    indexGetController
);

router.post(
  '/number',
    isLoggedIn,
    isComplete,
    numberPostController
);

module.exports = router;
