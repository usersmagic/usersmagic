const express = require('express');
const router = express.Router();

const isComplete = require('../middleware/isComplete');
const isConfirmed = require('../middleware/isConfirmed');
const isLoggedIn = require('../middleware/isLoggedIn');

const indexGetController = require('../controllers/waiting/get');

router.get(
  '/',
    isLoggedIn,
    isConfirmed,
    isComplete,
    indexGetController
);

module.exports = router;
