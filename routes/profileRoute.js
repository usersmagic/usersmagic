const express = require('express');

const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const isLocationComplete = require('../middleware/isLocationComplete');

const indexGetController = require('../controllers/profile/index/get');
const userGetController = require('../controllers/profile/user/get');
const paymentGetController = require('../controllers/profile/payment/get');
const logoutGetController = require('../controllers/profile/logout/get');
const townGetController = require('../controllers/profile/town/get');

const indexPostController = require('../controllers/profile/index/post');
const paymentPostController = require('../controllers/profile/payment/post');

router.get(
  '/',
    isLoggedIn,
    indexGetController
);
router.get(
  '/user',
    isLoggedIn,
    userGetController
);
router.get(
  '/payment',
    isLoggedIn,
    isLocationComplete,
    paymentGetController
);
router.get(
  '/logout',
    isLoggedIn,
    logoutGetController
);
router.get(
  '/town',
    isLoggedIn,
    townGetController
);

router.post(
  '/',
    isLoggedIn,
    indexPostController
);
router.post(
  '/payment',
    isLoggedIn,
    paymentPostController
);

module.exports = router;
