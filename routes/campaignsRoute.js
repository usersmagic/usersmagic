const express = require('express');

const router = express.Router();

const isConfirmed = require('../middleware/isConfirmed');
const isComplete = require('../middleware/isComplete');
const isLoggedIn = require('../middleware/isLoggedIn');
const isLocationComplete = require('../middleware/isLocationComplete');

const userGetController = require('../controllers/campaigns/user/get');
const indexGetController = require('../controllers/campaigns/index/get');
const joinGetController = require('../controllers/campaigns/join/get');

router.get(
  '/',
    isLoggedIn,
    isConfirmed,
    isComplete,
    indexGetController
);
router.get(
  '/join',
    isLoggedIn,
    isConfirmed,
    isComplete,
    // isLocationComplete,
    joinGetController
);
router.get(
  '/user',
    isLoggedIn,
    isConfirmed,
    isComplete,
    userGetController
);

module.exports = router;
