const nodemailer = require('nodemailer');

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

// Hàm gửi email chứa OTP
const sendOtpEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: `"Your App Name" <${process.env.MAIL_USER}>`,
            to: email,
            subject: 'Your OTP Code',
            html: `<p>Your OTP code is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
        };
        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${email}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Could not send OTP email.');
    }
};

module.exports = { sendOtpEmail };