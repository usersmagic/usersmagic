const express = require('express');
const router = express.Router();

const isComplete = require('../middleware/isComplete');
const isLoggedIn = require('../middleware/isLoggedIn');

const indexGetController = require('../controllers/wallet/index/get');
const paymentGetController = require('../controllers/wallet/payment/get');

const numberPostController = require('../controllers/wallet/number/post');

router.get(
  '/',
    isLoggedIn,
    isComplete,
    indexGetController
);
router.get(
  '/payment',
    isLoggedIn,
    isComplete,
    paymentGetController
);

router.post(
  '/number',
    isLoggedIn,
    isComplete,
    numberPostController
);

module.exports = router;
