const express = require('express');

const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const userIndexGetController = require('../controllers/profile/user/index/get');
const userPaymentGetController = require('../controllers/profile/user/payment/get');
const userLogoutGetController = require('../controllers/profile/user/logout/get');

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
    userPaymentGetController
);
router.get(
  '/user/logout',
    isLoggedIn,
    userLogoutGetController
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
