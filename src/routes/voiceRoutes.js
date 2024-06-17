const express = require('express');
const { handleIncomingCall, handleAnswer } = require('../controllers/voiceController');
const router = express.Router();

router.post('/', handleIncomingCall);
router.post('/answer', handleAnswer);

module.exports = router;
