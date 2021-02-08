const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const indexGetController = require('../controllers/countries/index/get');
const townsGetController = require('../controllers/countries/towns/get');

router.get(
  '/',
    isLoggedIn,
    indexGetController
);
router.get(
  '/towns',
    isLoggedIn,
    townsGetController
);

module.exports = router;
