const { PrismaClient } = require("../generated/prisma");
const bcrypt = require('bcrypt');
const { generateOTP } = require('../utils/otp.util');
const { sendOtpEmail } = require('../services/mail.service');

const prisma = new PrismaClient();


const startRegistration = async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        await prisma.otpVerification.deleteMany({ where: { email } });

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.otpVerification.create({
            data: { email, otp, hashedPassword, name, expiresAt },
        });

        await sendOtpEmail(email, otp);

        res.status(200).json({ message: 'OTP has been sent to your email. Please verify.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};


const verifyRegistration = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    try {
        const record = await prisma.otpVerification.findUnique({ where: { email } });

        if (!record) {
            return res.status(404).json({ message: 'No pending registration found. Please start over.' });
        }

        if (new Date() > record.expiresAt) {
            await prisma.otpVerification.delete({ where: { email } });
            return res.status(410).json({ message: 'OTP has expired. Please request a new one.' });
        }

        if (record.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        const newUser = await prisma.user.create({
            data: {
                email: record.email,
                password: record.hashedPassword,
                name: record.name,
            },
        });

        await prisma.otpVerification.delete({ where: { email } });

        const { password, ...userWithoutPassword } = newUser;
        res.status(201).json({
            message: 'User registered successfully!',
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};

module.exports = {
    startRegistration,
    verifyRegistration,
};