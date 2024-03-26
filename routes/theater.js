// theaterRoutes.js
const express = require('express');
const router = express.Router();
const Theater = require('../Models/theatre_model');

// Create a new theater
router.post('/theater/create', async (req, res) => {
    try {
        const theater = await Theater.create(req.body);
        res.status(201).json(theater);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get all theaters
router.get('/theaters', async (req, res) => {
    try {
        const theaters = await Theater.find();
        res.json(theaters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get a theater by ID
router.get('/theaters/:id', async (req, res) => {
    try {
        const theater = await Theater.findById(req.params.id);
        if (!theater) {
            return res.status(404).json({ message: 'Theater not found' });
        }
        res.json(theater);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.get('/theaters/:movie/:date', async (req, res) => {
    let { movie, date } = req.params
    try {
        const theater = await Theater.findOne({ "show_movies.movie": movie, "show_movies.date": date });
        if (!theater) {
            return res.status(404).json({ message: 'Theater not found' });
        }
        res.send(theater.show_movies.filter((element) => {
            if (element.movie == movie && element.date == date) {
                return element
            }
        })[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update a theater by ID
router.put('/theaters/:id', async (req, res) => {
    try {
        const theater = await Theater.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!theater) {
            return res.status(404).json({ message: 'Theater not found' });
        }
        res.json(theater);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.post('/theaters-add-movie/:id', async (req, res) => {
    const theaterId = req.params.id;
    const { movie, date, price } = req.body;
    try {
        const theater = await Theater.findById(theaterId);
        let ticketPlace = theater.ticketPlaces.y.map(mark => {
            let place = []
            for (let index = 0; index < theater.ticketPlaces.x; index++) {
                place[index] = {
                    place: `${mark.toUpperCase()}${index + 1}`,
                    userId: ""
                }

            }

            return place
        })


        // Yangi kino malumoti obyektini yaratish
        const newShowMovie = {
            movie: movie,
            date,
            price,
            forTicketPlace: ticketPlace
        };


        const updatedTheater = await Theater.findByIdAndUpdate(
            theaterId,
            { $push: { show_movies: newShowMovie } },
            { new: true }
        )
        if (!updatedTheater) {
            return res.status(404).json({ message: 'Theater not found' });
        }
        res.send(updatedTheater)
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
        return
    }
});

// Delete a theater by ID
router.delete('/theaters/:id', async (req, res) => {
    try {
        const theater = await Theater.findByIdAndDelete(req.params.id);
        if (!theater) {
            return res.status(404).json({ message: 'Theater not found' });
        }
        res.json({ message: 'Theater deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
