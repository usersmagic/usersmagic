const express = require('express');

const router = express.Router();

const isComplete = require('../middleware/isComplete');
const isLoggedIn = require('../middleware/isLoggedIn');
const isLocationComplete = require('../middleware/isLocationComplete');

const userGetController = require('../controllers/campaigns/user/get');
const indexGetController = require('../controllers/campaigns/index/get');
const joinGetController = require('../controllers/campaigns/join/get');

router.get(
  '/',
    isLoggedIn,
    isComplete,
    indexGetController
);
router.get(
  '/join',
    isLoggedIn,
    isComplete,
    // isLocationComplete,
    joinGetController
);
router.get(
  '/user',
    isLoggedIn,
    isComplete,
    userGetController
);

module.exports = router;
