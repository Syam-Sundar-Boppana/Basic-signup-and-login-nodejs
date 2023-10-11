const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb://127.0.0.1:27017/login-signup');

connect
.then()
.catch(err => console.log(err));

const LoginSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

const collection = new mongoose.model('users', LoginSchema);


module.exports = collection;