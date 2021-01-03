const express = require('express');

const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const isLocationComplete = require('../middleware/isLocationComplete');

const userGetController = require('../controllers/campaigns/user/get');
const indexGetController = require('../controllers/campaigns/index/get');
const joinGetController = require('../controllers/campaigns/join/get');

router.get(
  '/',
    isLoggedIn,
    indexGetController
);
router.get(
  '/join',
    isLoggedIn,
    isLocationComplete,
    joinGetController
);
router.get(
  '/user',
    isLoggedIn,
    userGetController
);

module.exports = router;
