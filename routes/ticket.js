// ticketRoutes.js
const express = require('express');
const router = express.Router();
const Ticket = require('../Models/ticket_models');
const User = require('../Models/user_model');

// Create a new ticket
router.post('/ticket/create', async (req, res) => {
    let { _date, _theaterId, places, summ, _movie } = req.body
    let user = await User.findOne({ email: req.user.email })
    let _userId = user._id

    try {

        const ticket = await Ticket.create({ _date, _theaterId, _userId, places, summ, status: summ ? true : false, _movie });
        res.status(201).json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get("/tickets/:theaterId/:date", async (req, res) => {
    let { date, theaterId } = req.params
    try {
        const ticket = await Ticket.find({ _theaterId: theaterId, _date: date });
        res.status(201).json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
})

// Get all tickets
router.get('/tickets', async (req, res) => {
    try {
        const ticket = await Ticket.find();
        res.json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get a ticket by ID
router.get('/ticket/:id', async (req, res) => {

    try {
        const ticket = await Ticket.findById(req.params.id).populate("_movie").populate("_theaterId", { ticketPlaces: 0 }).populate("_userId", { _id: 0, __v: 0, password: 0 });
        if (req.user.email === ticket._userId)
            if (!ticket) {
                return res.status(404).json({ message: 'ticket not found' });
            }
        res.json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update a ticket by ID
router.put('/tickets/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!ticket) {
            return res.status(404).json({ message: 'ticket not found' });
        }
        res.json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});




// Delete a ticket by ID
router.delete('/tickets/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'ticket not found' });
        }
        res.json({ message: 'ticket deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
