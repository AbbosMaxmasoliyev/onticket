var mongoose = require("mongoose")
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    userId: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        require: true,
    },
    history: [{

    }]
});


var User = mongoose.model('User_model', UserSchema);
module.exports = User;
