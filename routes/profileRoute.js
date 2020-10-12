const express = require('express');

const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const isLocationComplete = require('../middleware/isLocationComplete');

const userIndexGetController = require('../controllers/profile/user/index/get');
const userPaymentGetController = require('../controllers/profile/user/payment/get');
const userLogoutGetController = require('../controllers/profile/user/logout/get');
const userTownGetController = require('../controllers/profile/user/town/get');

const userIndexPostController = require('../controllers/profile/user/index/post');
const userPaymentPostController = require('../controllers/profile/user/payment/post');

router.get(
  '/user',
    isLoggedIn,
    userIndexGetController
);
router.get(
  '/user/payment',
    isLoggedIn,
    isLocationComplete,
    userPaymentGetController
);
router.get(
  '/user/logout',
    isLoggedIn,
    userLogoutGetController
);
router.get(
  '/user/town',
    isLoggedIn,
    userTownGetController
);

router.post(
  '/user',
    isLoggedIn,
    userIndexPostController
);
router.post(
  '/user/payment',
    isLoggedIn,
    userPaymentPostController
);

module.exports = router;
