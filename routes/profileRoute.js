const express = require('express');

const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const isComplete = require('../middleware/isComplete');
const isLocationComplete = require('../middleware/isLocationComplete');

const indexGetController = require('../controllers/profile/index/get');

router.get(
  '/',
    isLoggedIn,
    isComplete,
    indexGetController
);

module.exports = router;
