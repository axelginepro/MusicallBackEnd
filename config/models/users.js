const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    firstname: String,
    lastname: String,
    birthdate: String,
    pseudo: String,
    email: String,
    adresse: String,
    password: String,
    preference: [{
        style1: String,
        style2: String,
        style3: String,
    }]
});


const UserModel = mongoose.model('users', userSchema);


module.exports = UserModel;