const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({dest: './public/res/uploads/'});

const isLoggedIn = require('../middleware/isLoggedIn');
const isLoggedInCompany = require('../middleware/isLoggedInCompany');

const userIndexGetController = require('../controllers/test/user/index/get');
const companyIndexGetController = require('../controllers/test/company/index/get');

const userIndexPostController = require('../controllers/test/user/index/post');
const userSavePostController = require('../controllers/test/user/save/post');
const userSubmitPostController = require('../controllers/test/user/submit/post');
const companyPhotoPostController = require('../controllers/test/company/photo/post');
const companyFilterPostController = require('../controllers/test/company/filter/post');

router.get(
  '/user',
    isLoggedIn,
    userIndexGetController
);
router.get(
  '/company',
    isLoggedInCompany,
    companyIndexGetController
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
router.post(
  '/company/photo',
    upload.single('file'),
    isLoggedInCompany,
    companyPhotoPostController
);
router.post(
  '/company/filter',
    isLoggedInCompany,
    companyFilterPostController
);

module.exports = router;
