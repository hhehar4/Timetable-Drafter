const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', (req, res, next) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    
    User.addUser(user, (err, user) => {
        if(err) {
            res.json({success: false, msg: 'Failed to register'});
        } else {
            res.json({success: true, msg: 'User registered'});
        }
    });
});

module.exports = router;