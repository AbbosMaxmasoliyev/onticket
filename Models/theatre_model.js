var mongoose = require("mongoose")
const Schema = mongoose.Schema;

const TheaterSchema = new Schema({
    theater_name: {
        type: String,
        require: true
    },
    theater_id: {
        type: String,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    show_movies: [{
        movie: {
            type: Schema.Types.ObjectId,
            ref: "Movie_model"
        },
        date: {
            type: Number
        },
        price: {
            type: Number
        },
    }],
    ticketPlaces: {
        type: {
            x: {
                type: Number,
            },
            y: {
                type: [String]
            }
        },
        require: true
    }
});


var Theater = mongoose.model('Theater_model', TheaterSchema);
module.exports = Theater;
