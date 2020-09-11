const express = require('express');

const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const userIndexGetController = require('../controllers/campaigns/user/index/get');
const userJoinGetController = require('../controllers/campaigns/user/join/get');

router.get(
  '/user',
    isLoggedIn,
    userIndexGetController
);
router.get(
  '/user/join',
    isLoggedIn,
    userJoinGetController
);

module.exports = router;
