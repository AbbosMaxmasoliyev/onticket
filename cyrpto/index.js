const bcrypt = require('bcrypt');

// Parolni shifrlash
const encryptPassword = async (password) => {
    const saltRounds = 10; // Salt darajasi
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

// Solishtirish
const comparePasswords = async (enteredPassword, storedPassword) => {
    const isMatch = await bcrypt.compare(enteredPassword, storedPassword);
    return isMatch;
};

// // Misol uchun:
// const enteredPassword = 'password123';
// const storedPassword = await encryptPassword(enteredPassword);

// console.log('Stored Password:', storedPassword);

// // Foydalanuvchining kiritgan parolni solishtiramiz
// const isMatch = await comparePasswords(enteredPassword, storedPassword);
// console.log('Passwords Match:', isMatch);



module.exports = { encryptPassword, comparePasswords }