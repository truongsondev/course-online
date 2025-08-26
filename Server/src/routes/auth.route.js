const express = require('express');
const { startRegistration, verifyRegistration ,forgotPassword,verifyForgotPassword,changePassword} = require('../controllers/auth.controller');
const { sendOtpEmail } = require('../services/mail.service');

const router = express.Router();

router.post('/register/start', startRegistration);
router.post('/register/verify', verifyRegistration);
rputer.post('forgot-password', forgotPassword);
router.post('forgot-password/verify', verifyForgotPassword);
router.put('forgot-password/changePassword', changePassword);
module.exports = router;
