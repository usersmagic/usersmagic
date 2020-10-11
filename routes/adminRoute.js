const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({dest: './public/res/uploads/'});

const isAdmin = require('../middleware/isAdmin');

const indexGetController = require('../controllers/admin/index/get');
const loginGetController = require('../controllers/admin/auth/get');
const campaignsIndexGetController = require('../controllers/admin/campaigns/index/get');
const campaignsDeleteGetController = require('../controllers/admin/campaigns/delete/get');
const campaignsDetailsGetController = require('../controllers/admin/campaigns/details/get');
const campaignsPauseGetController = require('../controllers/admin/campaigns/pause/get');
const campaignsStartGetController = require('../controllers/admin/campaigns/start/get');
const paymentsIndexGetController = require('../controllers/admin/payments/index/get');
const paymentsApproveGetController = require('../controllers/admin/payments/approve/get');
const submitionsIndexGetController = require('../controllers/admin/submitions/index/get');
const submitionsApproveGetController = require('../controllers/admin/submitions/approve/get');
const submitionsApproveAllGetController = require('../controllers/admin/submitions/approve_all/get');
const usersIndexGetController = require('../controllers/admin/users/index/get');
const usersDetailsGetController = require('../controllers/admin/users/details/get');
const usersDataGetController = require('../controllers/admin/users/data/get');
const questionsIndexGetController = require('../controllers/admin/questions/index/get');
const questionsDetailsGetController = require('../controllers/admin/questions/details/get')
const questionsDeleteGetController = require('../controllers/admin/questions/delete/get');
const updateGetController = require('../controllers/admin/update/get');
const informationGetController = require('../controllers/admin/information/get');
const privateCampaignsIndexGetController = require('../controllers/admin/private_campaigns/index/get');
const privateCampaignsApproveGetController = require('../controllers/admin/private_campaigns/approve/get');
const privateCampaignsDetailsGetController = require('../controllers/admin/private_campaigns/details/get');
const privateCampaignsDetailsApproveGetController = require('../controllers/admin/private_campaigns/details/approve');
const privateCampaignsSubmitionsIndexGetController = require('../controllers/admin/private_campaigns/submitions/index/get');
const privateCampaignsSubmitionsApproveGetController = require('../controllers/admin/private_campaigns/submitions/approve/get');
const commercialsIndexGetController = require('../controllers/admin/commercials/index/get');
const commercialsDeleteGetController = require('../controllers/admin/commercials/delete/get');

const loginPostController = require('../controllers/admin/auth/post');
const campaignsIndexPostController = require('../controllers/admin/campaigns/index/post');
const campaignsDetailsPostController = require('../controllers/admin/campaigns/details/post');
const campaignsDetailsPhotoPostController = require('../controllers/admin/campaigns/details/photo');
const campaignsVersionPostController = require('../controllers/admin/campaigns/version/post');
const submitionsRejectPostController = require('../controllers/admin/submitions/reject/post');
const questionsIndexPostController = require('../controllers/admin/questions/index/post');
const questionsDetailsPostController = require('../controllers/admin/questions/details/post');
const privateCampaignsDetailsPostController = require('../controllers/admin/private_campaigns/details/post');
const privateCampaignsSubmitionsRejectPostController = require('../controllers/admin/private_campaigns/submitions/reject/post');
const commercialsIndexPostController = require('../controllers/admin/commercials/index/post');

router.get(
  '/',
    isAdmin,
    indexGetController
);
router.get(
  '/update',
    isAdmin,
    updateGetController
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
  '/campaigns/delete',
    isAdmin,
    campaignsDeleteGetController
);
router.get(
  '/campaigns/details',
    isAdmin,
    campaignsDetailsGetController
);
router.get(
  '/campaigns/pause',
    isAdmin,
    campaignsPauseGetController
);
router.get(
  '/campaigns/start',
    isAdmin,
    campaignsStartGetController
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
router.get(
  '/submitions/approve_all',
    isAdmin,
    submitionsApproveAllGetController
);
router.get(
  '/users',
    isAdmin,
    usersIndexGetController
);
router.get(
  '/users/details',
    isAdmin,
    usersDetailsGetController
);
router.get(
  '/users/data',
    isAdmin,
    usersDataGetController
);
router.get(
  '/questions',
    isAdmin,
    questionsIndexGetController
);
router.get(
  '/questions/details',
    isAdmin,
    questionsDetailsGetController
);
router.get(
  '/questions/delete',
    isAdmin,
    questionsDeleteGetController
);
router.get(
  '/information',
    isAdmin,
    informationGetController
);
router.get(
  '/private_campaigns',
    isAdmin,
    privateCampaignsIndexGetController
);
router.get(
  '/private_campaigns/details',
    isAdmin,
    privateCampaignsDetailsGetController
);
router.get(
  '/private_campaigns/details/approve',
    isAdmin,
    privateCampaignsDetailsApproveGetController
);
router.get(
  '/private_campaigns/submitions',
    isAdmin,
    privateCampaignsSubmitionsIndexGetController
);
router.get(
  '/private_campaigns/submitions/approve',
    isAdmin,
    privateCampaignsSubmitionsApproveGetController
);
router.get(
  '/private_campaigns/approve',
    isAdmin,
    privateCampaignsApproveGetController
);
router.get(
  '/commercials',  
    isAdmin,
    commercialsIndexGetController
);
router.get(
  '/commercials/delete',
    isAdmin,
    commercialsDeleteGetController
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
  '/campaigns/details',
    isAdmin,
    campaignsDetailsPostController
);
router.post(
  '/campaigns/details/photo',
    upload.single('file'),
    isAdmin,
    campaignsDetailsPhotoPostController
);
router.post(
  '/campaigns/version',
    isAdmin,
    campaignsVersionPostController
);
router.post(
  '/submitions/reject',
    isAdmin,
    submitionsRejectPostController  
);
router.post(
  '/questions',
    isAdmin,
    questionsIndexPostController
);
router.post(
  '/questions/details',
    isAdmin,
    questionsDetailsPostController
);
router.post(
  '/private_campaigns/submitions/reject',
    isAdmin,
    privateCampaignsSubmitionsRejectPostController
);
router.post(
  '/commercials',
    upload.single('file'),
    isAdmin,
    commercialsIndexPostController
);

module.exports = router;
