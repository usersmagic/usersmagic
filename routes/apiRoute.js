const express = require('express');
const router = express.Router();

const heatMapDetailsGetController = require('../controllers/api/heat_map/details/get'),
const testDetailsGetController = require('../controllers/api/test/details/get');

const heatMapDetailsPostController = require('../controllers/api/heat_map/details/post');

router.get(
  '/heat_map/details',
    heatMapDetailsGetController
);
router.get(
  '/test/details',
    testDetailsGetController
);

router.post(
  '/heat_map/details',
    heatMapDetailsPostController
);

module.exports = router;
