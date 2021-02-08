const express = require('express');

const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const isComplete = require('../middleware/isComplete');

const indexGetController = require('../controllers/test/index/get');
const filterGetController = require('../controllers/test/filter/get');
const submitGetController = require('../controllers/test/submit/get');

const savePostController = require('../controllers/test/save/post');

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
  '/submit',
    isLoggedIn,
    isComplete,
    submitGetController
);

router.post(
  '/save',
    isLoggedIn,
    isComplete,
    savePostController
);

module.exports = router;
