//Implemented schema and functions following this tutorial: https://www.youtube.com/watch?v=1ZeDy2QI3OE
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["USER", "ADMIN"]
    },
    active: {
        type: Boolean,
        required: true
    }
});

const User = module.exports = mongoose.model('User', userSchema);

module.exports.addUser = function(newUser, callback) {
    //Encrypt user password using salt + hash before saving into DB
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePass = function(userIn, hash, callback) {
    //Compare using the enrypted passwords
    bcrypt.compare(userIn, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    })
}