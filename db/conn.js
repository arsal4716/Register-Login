const session = require('express-session');
const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://127.0.0.1:27017/authentication', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
const RegisterSchema = new mongoose.Schema({
    email:{
        type: String, 
        required: true, 
        unique: true
    }, 
    password: {
        type: String,
        required: true,
        minLength: 4
    }
});
const User = new mongoose.model("User", RegisterSchema);

module.exports = User;