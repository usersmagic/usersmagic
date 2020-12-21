const express = require('express');
const router = express.Router();

const isApiAuthenticated = require('../middleware/isApiAuthenticated');

const heatMapDetailsGetController = require('../controllers/api/heat_map/details/get');
const testDetailsGetController = require('../controllers/api/test/details/get');

const heatMapDetailsPostController = require('../controllers/api/heat_map/details/post');

router.get(
  '/heat_map/details',
    // isApiAuthenticated,
    heatMapDetailsGetController
);
router.get(
  '/test/details',
    // isApiAuthenticated,
    testDetailsGetController
);

router.post(
  '/heat_map/details',
    // isApiAuthenticated,
    heatMapDetailsPostController
);

module.exports = router;
