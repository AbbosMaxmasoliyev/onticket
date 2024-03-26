const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const movieRoutes = require('./routes/movie');
const theaterRoutes = require('./routes/theater');
const ticketRoutes = require('./routes/ticket');
const bcrypt = require("bcrypt")
const User = require('./Models/user_model');
const { encryptPassword, comparePasswords } = require('./cyrpto');
const { encryptData, decryptData } = require('./cyrpto/jwt');
const auth = require('./midlleware/auth');
const OTPRouter = require('./routes/otp');


const app = express();
const PORT = process.env.PORT;
const secret_key = process.env.SECRET_KEY;
const MONGODB = process.env.MONGODB;

// MongoDBga ulanish
mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Middleware
app.use(express.json());
app.use(cors());
app.use(require("body-parser")());

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;


    try {
        // Foydalanuvchining parolini shifrlash

        // Foydalanuvchi obyektini yaratish va foydalanuvchilar bazasiga qo'shish

        let userExisting = await User.findOne({ email });
        if (userExisting?._id) {
            res.status(501).send("User already exists")
            return;
        }
        const hashedPassword = await encryptPassword(password, 10); // 10 - salt darajasi

        let user = await User.create({ email, password: hashedPassword })

        res.status(201).json({ message: 'User signed up successfully', user });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Kiring (login) uchun endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;


    try {
        // Foydalanuvchini bazadan izlash
        const user = await User.findOne({ email });

        // Foydalanuvchi mavjud emas yoki parol noto'g'ri
        if (!user || !(await comparePasswords(password, user.password))) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        // Foydalanuvchining ma'lumotlari uchun token yaratish
        const token = encryptData({ email, password }, secret_key); // 1 soat muddatga berilgan token

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});



app.get('/admin', async (req, res) => {
    const { authorization } = req.headers;
    let { email } = decryptData(authorization)
    if (email) {
        try {
            // Foydalanuvchini bazadan izlash
            const user = await User.findOne({ email });

            // Foydalanuvchi mavjud emas yoki parol noto'g'ri
            if (!user) {
                res.status(401).send({ message: 'Invalid username or password' });
                return;
            }

            // Foydalanuvchining ma'lumotlari uchun token yaratish
            if (user.role === "admin") {

                res.status(200).send({ message: "success" });
                return
            }

            res.status(500).send("Server Error");
            return

        } catch (error) {
            console.error('Error logging in user:', error);
            res.status(500).send('Server Error');
            return
        }
    }
    res.status(500).send("Xatolik ro'y bermoqda, hisobingizga qayta kiring")
    return
});
// Routes
app.use(theaterRoutes);
app.use(movieRoutes);
app.use(userRoutes);
app.use(auth, ticketRoutes);
app.use("/otp", auth, OTPRouter);








// 8bk4z5d7mO3z6GkU

// mongodb+srv://otajonmaxmasoliyev775:8bk4z5d7mO3z6GkU@cluster0.kxakstb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});