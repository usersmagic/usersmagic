const express = require('express');

const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const isComplete = require('../middleware/isComplete');
const isConfirmed = require('../middleware/isConfirmed');
const isLocationComplete = require('../middleware/isLocationComplete');

const indexGetController = require('../controllers/profile/index/get');

router.get(
  '/',
    isLoggedIn,
    isConfirmed,
    isComplete,
    indexGetController
);

module.exports = router;
