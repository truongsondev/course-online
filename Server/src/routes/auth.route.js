const express = require('express');
const { startRegistration, verifyRegistration } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register/start', startRegistration);
router.post('/register/verify', verifyRegistration);

module.exports = router;
