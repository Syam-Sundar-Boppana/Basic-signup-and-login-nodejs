const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb://127.0.0.1:27017/login-signup');

connect
.then()
.catch(err => console.log(err));

const TaskSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    userName:{
        type: String,
        required:true
    }
});

const taskCollection = new mongoose.model('tasks', TaskSchema);


module.exports = taskCollection;