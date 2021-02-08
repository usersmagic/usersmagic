const express = require('express');
const router = express.Router();

const isComplete = require('../middleware/isComplete');
const isLocationComplete = require('../middleware/isLocationComplete');
const isLoggedIn = require('../middleware/isLoggedIn');

const indexGetController = require('../controllers/filters/index/get');
const joinGetController = require('../controllers/filters/join/get');

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

module.exports = router;
