const express = require('express');
const { handleIncomingSms } = require('../controllers/smsController');
const router = express.Router();

router.post('/', handleIncomingSms);

module.exports = router;
