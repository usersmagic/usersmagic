const express = require('express');
const router = express.Router();

const indexGetController = require('../controllers/tester/get');

const indexPostController = require('../controllers/tester/post');

router.get(
  '/', 
    indexGetController
);

router.post(
  '/',
    indexPostController
);

module.exports = router;
