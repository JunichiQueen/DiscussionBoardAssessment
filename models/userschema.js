const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: String,
    password: {
        type: String,
        required: true
    }
});

module.exports = User = mongoose.model('user', userSchema);