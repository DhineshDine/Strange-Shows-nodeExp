const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/send-email', async (req, res) => {
    const { to, subject, html } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        });

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('💥 Email error:', error);
        res.status(500).json({ message: 'Failed to send email', error });
    }
});

module.exports = router;
