const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({dest: './public/res/uploads/'});

const isLoggedInCompany = require('../middleware/isLoggedInCompany');

const indexGetController = require('../controllers/dashboard/index/get');

const createPostController = require('../controllers/dashboard/create/post');
const photoPostController = require('../controllers/dashboard/photo/post');

router.get(
  '/',
    isLoggedInCompany,
    indexGetController
);

router.post(
  '/create',
    isLoggedInCompany,
    createPostController
);
router.post(
  '/photo',
    upload.single('file'),
    isLoggedInCompany,
    photoPostController
);


module.exports = router;
