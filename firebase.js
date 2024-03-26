const express = require("express")
const fireBaseRouter = express.Router()
// Firebase kutubxonasini yuklash
const admin = require('firebase-admin');
const auth = admin.auth();


const serviceAccount = require('./firebase.json');
admin.initializefireBaseRouter({
    credential: admin.credential.cert(serviceAccount)
});
// Foydalanuvchiga OTP yuborish uchun endpoint
fireBaseRouter.post('/sendOTP', async (req, res) => {
    const { email } = req.body;

    try {
        // Foydalanuvchini email orqali identifikatsiya qilish
        const userRecord = await auth.getUserByEmail(email);

        // Firebase orqali OTP yuborish
        const otp = await auth.generateSignInWithEmailLink(email, actionCodeSettings);

        // Foydalanuvchiga OTP yuborish
        // Bu qismni frontendda amalga oshirish kerak
        console.log('OTP:', otp);

        res.status(200).json({ message: 'OTP yuborildi' });
    } catch (error) {
        console.error('Xatolik:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// Foydalanuvchining kiritgan OTPni tekshirish uchun endpoint
fireBaseRouter.post('/verifyOTP', async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Foydalanuvchi email va OTP orqali tekshirish
        const result = await auth.verifySignInEmail(otp, email);

        res.status(200).json({ message: 'OTP to\'g\'ri' });
    } catch (error) {
        console.error('Xatolik:', error);
        res.status(400).json({ error: 'OTP noto\'g\'ri' });
    }
});


module.exports = fireBaseRouter
