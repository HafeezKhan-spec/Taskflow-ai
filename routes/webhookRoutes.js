const express = require('express');
const {
  receiveOutlook,
  receiveSalesforce,
  receiveMonday,
} = require('../controllers/webhookController');

const router = express.Router();

router.post('/outlook', receiveOutlook);
router.post('/salesforce', receiveSalesforce);
router.post('/monday', receiveMonday);

module.exports = router;
