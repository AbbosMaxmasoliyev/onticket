var mongoose = require("mongoose")
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    movie_name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    duration: {

        type: {
            hour: {
                type: Number,
            },
            min: {
                type: Number,
            },
        },
        require: true
    },

    start_date: {
        type: Number,
        require: true
    },

    finish_date: {
        type: Number,
        require: true
    },
    cover: {
        type: String,
        require: true
    }

});


var Movie = mongoose.model('Movie_model', MovieSchema);
module.exports = Movie;
