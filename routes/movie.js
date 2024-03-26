// movieRoutes.js
const express = require('express');
const router = express.Router();
const Movie = require('../Models/movie_model');
const fs = require("fs")

const cloudinary = require('cloudinary').v2;

const multer = require('multer');
const Theater = require('../Models/theatre_model');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const fileName = new Date().getTime() + '-' + file.originalname;
        cb(null, fileName);
    }
});
// Cloudinary configuration
const upload = multer({ storage: storage })

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});




// Express route for image upload


router.post('/movie', upload.single('cover'), async (req, res) => {
    try {
        const { movie_name, description, duration, start_date, finish_date } = req.body;
        const { hour, min } = duration;

        // Cloudinary ga rasmni yuborish
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'folder_name'
        });
        if (result?.asset_id) {
            await fs.unlinkSync(req.file.path)
        }

        // Olingan rasmning URL sini olish
        const imageUrl = result.secure_url;

        const movie = await Movie.create({
            movie_name,
            description,
            duration: { hour, min },
            start_date,
            finish_date,
            cover: imageUrl // Cloudinary dan olingan rasmning URL sini saqlash
        });

        res.status(201).json(movie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get all movies
router.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.send(movies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get a movie by ID
router.get('/movie/:id', async (req, res) => {
    let selectedMovieId = req.params.id
    try {
        let responseTheater = await Theater.find({ 'show_movies.movie': selectedMovieId });;
        let responseMovie = await Movie.findById(selectedMovieId, { _id: 0, start_date: 0, finish_date: 0, _v: 0 });

        res.send({ theater: responseTheater, movie: responseMovie })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update a movie by ID
router.put('/movie/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(movie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete a movie by ID
router.delete('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json({ message: 'Movie deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
