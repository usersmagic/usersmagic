const express = require('express');

const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const isComplete = require('../middleware/isComplete');

const indexGetController = require('../controllers/test/index/get');
const filterGetController = require('../controllers/test/filter/get');
const customIndexGetController = require('../controllers/test/custom/index/get');
const submitGetController = require('../controllers/test/submit/get');
const customSubmitGetController = require('../controllers/test/custom/submit/get');

const savePostController = require('../controllers/test/save/post');
const customSavePostController = require('../controllers/test/custom/save/post');

router.get(
  '/',
    isLoggedIn,
    isComplete,
    indexGetController
);
router.get(
  '/filter',
    isLoggedIn,
    isComplete,
    filterGetController
);
router.get(
  '/custom',
    customIndexGetController
);
router.get(
  '/submit',
    isLoggedIn,
    isComplete,
    submitGetController
);
router.get(
  '/custom/submit',
    customSubmitGetController
);

router.post(
  '/save',
    isLoggedIn,
    isComplete,
    savePostController
);
router.post(
  '/custom/save',
    customSavePostController
);

module.exports = router;
