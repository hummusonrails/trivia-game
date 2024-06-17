const express = require('express');
const { handleDeliveryStatus } = require('../controllers/callbackController');
const router = express.Router();

router.post('/status', handleDeliveryStatus);

module.exports = router;
