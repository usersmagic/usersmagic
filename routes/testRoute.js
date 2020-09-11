const express = require('express');

const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const userIndexGetController = require('../controllers/test/user/index/get');

const userIndexPostController = require('../controllers/test/user/index/post');
const userSavePostController = require('../controllers/test/user/save/post');
const userSubmitPostController = require('../controllers/test/user/submit/post');

router.get(
  '/user',
    isLoggedIn,
    userIndexGetController
);

router.post(
  '/user',
    isLoggedIn,
    userIndexPostController
);
router.post(
  '/user/save',
    isLoggedIn,
    userSavePostController
);
router.post(
  '/user/submit',
    isLoggedIn,
    userSubmitPostController
);

module.exports = router;
