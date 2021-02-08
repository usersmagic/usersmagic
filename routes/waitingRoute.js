const express = require('express');
const router = express.Router();

const isComplete = require('../middleware/isComplete');
const isLoggedIn = require('../middleware/isLoggedIn');

const indexGetController = require('../controllers/waiting/get');

router.get(
  '/',
    isLoggedIn,
    isComplete,
    indexGetController
);

module.exports = router;
