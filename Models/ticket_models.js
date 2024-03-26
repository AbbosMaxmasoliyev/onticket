var mongoose = require("mongoose")
const Schema = mongoose.Schema;

const TicketMovie = new Schema({
    _theaterId: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "Theater_model"
    },
    _userId: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "User_model"
    },
    _date: {
        type: Number,
        require: true
    },
    places: [{
        type: {
            x: Number,
            y: String
        }
    }],
    _movie: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "Movie_model"
    },
    summ: {
        type: Number,
        require: true
    },
    status: {
        type: Boolean,
        default: false
    }
});


var Tickets = mongoose.model('Tickets', TicketMovie);
module.exports = Tickets;
