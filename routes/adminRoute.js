const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({dest: './public/res/uploads/'});

const isAdmin = require('../middleware/isAdmin');

const indexGetController = require('../controllers/admin/index/get');
const loginGetController = require('../controllers/admin/auth/get');
const campaignsIndexGetController = require('../controllers/admin/campaigns/index/get');
const paymentsIndexGetController = require('../controllers/admin/payments/index/get');
const paymentsApproveGetController = require('../controllers/admin/payments/approve/get');
const submitionsIndexGetController = require('../controllers/admin/submitions/index/get');
const submitionsApproveGetController = require('../controllers/admin/submitions/approve/get');

const loginPostController = require('../controllers/admin/auth/post');
const campaignsIndexPostController = require('../controllers/admin/campaigns/index/post');
const submitionsRejectPostController = require('../controllers/admin/submitions/reject/post');

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
router.get(
  '/payments',
    isAdmin,
    paymentsIndexGetController
);
router.get(
  '/payments/approve',
    isAdmin,
    paymentsApproveGetController
);
router.get(
  '/submitions',
    isAdmin,
    submitionsIndexGetController
);
router.get(
  '/submitions/approve',
    isAdmin,
    submitionsApproveGetController
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
router.post(
  '/submitions/reject',
    isAdmin,
    submitionsRejectPostController  
);

module.exports = router;