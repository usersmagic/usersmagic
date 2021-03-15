const express = require('express');

const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const isComplete = require('../middleware/isComplete');

const campaignIndexGetController = require('../controllers/test/campaign/index/get');
const campaignSubmitGetController = require('../controllers/test/campaign/submit/get');
const customIndexGetController = require('../controllers/test/custom/index/get');
const customSubmitGetController = require('../controllers/test/custom/submit/get');
const filterIndexGetController = require('../controllers/test/filter/index/get');
const filterSubmitGetController = require('../controllers/test/filter/submit/get');

const campaignSavePostController = require('../controllers/test/campaign/save/post');
const customSavePostController = require('../controllers/test/custom/save/post');
const filterSavePostController = require('../controllers/test/filter/save/post');

router.get(
  '/campaign',
    isLoggedIn,
    isComplete,
    campaignIndexGetController
);
router.get(
  '/custom',
    customIndexGetController
);
router.get(
  '/filter',
    isLoggedIn,
    isComplete,
    filterIndexGetController
);
router.get(
  '/campaign/submit',
    isLoggedIn,
    isComplete,
    campaignSubmitGetController
);
router.get(
  '/custom/submit',
    customSubmitGetController
);
router.get(
  '/filter/submit',
    isLoggedIn,
    isComplete,
    filterSubmitGetController
);

router.post(
  '/campaign/save',
    isLoggedIn,
    isComplete,
    campaignSavePostController
);
router.post(
  '/custom/save',
    customSavePostController
);
router.post(
  '/filter/save',
    isLoggedIn,
    isComplete,
    filterSavePostController
);

module.exports = router;
