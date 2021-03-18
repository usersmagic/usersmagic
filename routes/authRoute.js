const express = require('express');
const router = express.Router();

const isConfirmed = require('../middleware/isConfirmed');
const isLoggedIn = require('../middleware/isLoggedIn');

const loginGetController = require('../controllers/auth/login/get');
const registerGetController = require('../controllers/auth/register/get');
const completeGetController = require('../controllers/auth/complete/get');
const confirmGetController = require('../controllers/auth/confirm/get');
const lostPasswordGetController = require('../controllers/auth/lost_password/get');
const changePasswordGetController = require('../controllers/auth/change_password/get');
const userGetController = require('../controllers/auth/user/get');

const loginPostController = require('../controllers/auth/login/post');
const registerPostController = require('../controllers/auth/register/post');
const completePostController = require('../controllers/auth/complete/post');
const lostPasswordPostController = require('../controllers/auth/lost_password/post');
const changePasswordPostController = require('../controllers/auth/change_password/post');

router.get(
  '/login',
    loginGetController
);
router.get(
  '/register',
    registerGetController
);
router.get(
  '/complete',
    isLoggedIn,
    isConfirmed,
    completeGetController
);
router.get(
  '/confirm', 
    isLoggedIn,
    confirmGetController
);
router.get(
  '/lost_password',
    lostPasswordGetController
);
router.get(
  '/change_password',
    changePasswordGetController
);
router.get(
  '/user',
    userGetController
);

router.post(
  '/login',
    loginPostController
);
router.post(
  '/register',
    registerPostController
);
router.post(
  '/complete',
    isLoggedIn,
    isConfirmed,
    completePostController
);
router.post(
  '/lost_password',
    lostPasswordPostController
);
router.post(
  '/change_password',
    changePasswordPostController
);

module.exports = router;
