const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const userLoginGetController = require('../controllers/auth/user/login/get');
const userRegisterGetController = require('../controllers/auth/user/register/get');
const userCompleteGetController = require('../controllers/auth/user/complete/get');

const userLoginPostController = require('../controllers/auth/user/login/post');
const userRegisterPostController = require('../controllers/auth/user/register/post');
const userCompletePostController = require('../controllers/auth/user/complete/post');

router.get(
  '/user/login',
    userLoginGetController
);
router.get(
  '/user/register',
    userRegisterGetController
);
router.get(
  '/user/complete',
    isLoggedIn,
    userCompleteGetController
);

router.post(
  '/user/login',
    userLoginPostController
);
router.post(
  '/user/register',
    userRegisterPostController
);
router.post(
  '/user/complete',
    isLoggedIn,
    userCompletePostController
);

module.exports = router;
