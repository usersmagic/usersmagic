const express = require('express');
const router = express.Router();

const isComplete = require('../middleware/isComplete');
const isConfirmed = require('../middleware/isConfirmed');
const isLoggedIn = require('../middleware/isLoggedIn');

const indexGetController = require('../controllers/wallet/index/get');
const paymentGetController = require('../controllers/wallet/payment/get');

const numberPostController = require('../controllers/wallet/number/post');

router.get(
  '/',
    isLoggedIn,
    isConfirmed,
    isComplete,
    indexGetController
);
router.get(
  '/payment',
    isLoggedIn,
    isConfirmed,
    isComplete,
    paymentGetController
);

router.post(
  '/number',
    isLoggedIn,
    isConfirmed,
    isComplete,
    numberPostController
);

module.exports = router;
