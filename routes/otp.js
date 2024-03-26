var express = require('express')
const router = express.Router()
const OTP = require('../Models/otp_models'); // MongoDB modelini chaqirish
// OTPni MongoDB ga yozish

const speakeasy = require('speakeasy');

// OTP yaratish
const otp = speakeasy.totp({
    secret: speakeasy.generateSecret({ length: 20 }).base32,
    digits: 4,
    step: 60 // Step (s) - kodning qancha muddatda yangilanishi kerak
});




const saveOTPToMongoDB = async (email, otp) => {
    try {
        const user = new OTP({ email, otp });
        await user.save();
        return user
    } catch (error) {
        console.error('OTP MongoDB ga saqlashda xatolik:', error);
    }
};


const verifyOTPFromMongoDB = async (email, otp) => {
    try {
        const user = await OTP.findOneAndDelete({ email, otp });
        if (user) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('OTPni MongoDB dan tekshirishda xatolik:', error);
        return false;
    }
};


router.get("/get", async (req, res) => {
    let { email } = req.user
    const otp = speakeasy.totp({
        secret: speakeasy.generateSecret({ length: 20 }).base32,
        digits: 4,
        step: 60 // Step (s) - kodning qancha muddatda yangilanishi kerak
    });
    let saveOtp = await saveOTPToMongoDB(email, otp)
    res.send(saveOtp)
})


router.post("/verify-otp", async (req, res) => {
    let { otp } = req.body
    let { email } = req.user
    let checkOTP = await verifyOTPFromMongoDB(email, otp)
    res.send(checkOTP)
})


module.exports = router