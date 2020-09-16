const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const isLoggedInCompany = require('../middleware/isLoggedInCompany');

const loginGetController = require('../controllers/auth/login/get');
const registerGetController = require('../controllers/auth/register/get');
const userLoginGetController = require('../controllers/auth/user/login/get');
const userRegisterGetController = require('../controllers/auth/user/register/get');
const userCompleteGetController = require('../controllers/auth/user/complete/get');
const companyLoginGetController = require('../controllers/auth/company/login/get');
const companyRegisterGetController = require('../controllers/auth/company/register/get');
const companyCompleteGetController = require('../controllers/auth/company/complete/get');

const userLoginPostController = require('../controllers/auth/user/login/post');
const userRegisterPostController = require('../controllers/auth/user/register/post');
const userCompletePostController = require('../controllers/auth/user/complete/post');
const companyLoginPostController = require('../controllers/auth/company/login/post');
const companyRegisterPostController = require('../controllers/auth/company/register/post');
const companyCompletePostController = require('../controllers/auth/company/complete/post');

router.get(
  '/login',
    loginGetController
);
router.get(
  '/register',
    registerGetController
);
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
router.get(
  '/company/login',
    companyLoginGetController
);
router.get(
  '/company/register',
    companyRegisterGetController
);
router.get(
  '/company/complete',
    isLoggedInCompany,
    companyCompleteGetController
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
router.post(
  '/company/login',
    companyLoginPostController
);
router.post(
  '/company/register',
    companyRegisterPostController
);
router.post(
  '/company/complete',
    isLoggedInCompany,
    companyCompletePostController
);

module.exports = router;
