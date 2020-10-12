const express = require('express');

const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const isLocationComplete = require('../middleware/isLocationComplete');
const isLoggedInCompany = require('../middleware/isLoggedInCompany');

const userIndexGetController = require('../controllers/campaigns/user/index/get');
const userJoinGetController = require('../controllers/campaigns/user/join/get');
const companyIndexGetController = require('../controllers/campaigns/company/index/get');

router.get(
  '/user',
    isLoggedIn,
    userIndexGetController
);
router.get(
  '/user/join',
    isLoggedIn,
    isLocationComplete,
    userJoinGetController
);
router.get(
  '/company',
    isLoggedInCompany,
    companyIndexGetController
);

module.exports = router;
