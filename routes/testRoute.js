const express = require('express');

const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const indexGetController = require('../controllers/test/index/get');

const indexPostController = require('../controllers/test/index/post');
const savePostController = require('../controllers/test/save/post');
const submitPostController = require('../controllers/test/submit/post');

router.get(
  '/',
    isLoggedIn,
    indexGetController
);

router.post(
  '/',
    isLoggedIn,
    indexPostController
);
router.post(
  '/save',
    isLoggedIn,
    savePostController
);
router.post(
  '/submit',
    isLoggedIn,
    submitPostController
);

module.exports = router;
