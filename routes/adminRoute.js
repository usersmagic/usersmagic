const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({dest: './public/res/uploads/'});

const isAdmin = require('../middleware/isAdmin');

const indexGetController = require('../controllers/admin/index/get');
const loginGetController = require('../controllers/admin/auth/get');
const campaignsIndexGetController = require('../controllers/admin/campaigns/index/get');

const loginPostController = require('../controllers/admin/auth/post');
const campaignsIndexPostController = require('../controllers/admin/campaigns/index/post');

router.get(
  '/',
    isAdmin,
    indexGetController
);
router.get(
  '/login',
    loginGetController
);
router.get(
  '/campaigns',
    isAdmin,
    campaignsIndexGetController
);

router.post(
  '/login',
    loginPostController
);
router.post(
  '/campaigns',
    upload.single('file'),
    isAdmin,
    campaignsIndexPostController
);

module.exports = router;
