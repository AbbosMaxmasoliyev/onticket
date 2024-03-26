const jwt = require('jsonwebtoken');

// Parolni shifrlash
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im90YWpvbm1heG1hc29saXlldjc3NUBnbWFpbC5jb20iLCJwYXNzd29yZCI6InFhcW51czMxMTIhIiwiaWF0IjoxNzExMzkxOTc4fQ.m5rlTKcOG0o7A5ffbhnEVdO3BaipsyX4Kfz0Vbc01Yc
const secretKey = process.env.SECRET_KEY;
const encryptData = (data,) => {
    return jwt.sign(data, secretKey);
};

// Ma'lumotni tekshirish
const decryptData = (token) => {
    try {
        const decodedData = jwt.verify(token, secretKey);
        return decodedData;
    } catch (error) {
        console.error('Error decrypting data:', error);
        return null;
    }
};

// Misol uchun:


// const expiresIn = '1h'; // 1 soat muddatga berilgan token
// const encryptedToken = encryptData(userData);

// console.log('Encrypted Token:', encryptedToken);

// // Tokenni tekshirish
// const decryptedData = decryptData(encryptedToken);
// console.log('Decrypted Data:', decryptedData);




module.exports = { encryptData, decryptData }