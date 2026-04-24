const express = require('express');
const { getNotifications } = require('../controllers/notificationController');

const router = express.Router();

router.route('/').get(getNotifications);

module.exports = router;
