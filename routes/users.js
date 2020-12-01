const express = require('express');
const router = express.Router();
const User = require('../models/User');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const passport = require('passport');

dotenv.config();

router.post('/register', (req, res, next) => {
    //ADD INPUT VALIDATION HERE
    //IF NAME == ADMINISTRATOR SEND res.json({success: false, msg: 'Failed to register'});
    const email = req.body.email;
    const user = new User({
        name: req.body.name,
        email: email,
        password: req.body.password,
        role: "USER",
        active: true
    });
    
    User.findOne({email: email}, (err, userCheck) => {
        if(err) throw err;
        if(!userCheck) {
            User.addUser(user, (err) => {
                if(err) {
                    res.json({success: false, msg: 'Failed to register'});
                } else {
                    res.json({success: true, msg: 'User registered'});
                }
            });
        }else {
            res.json({success: false, msg: 'Email already in use'});
        }
    });
});

router.post('/authenticate', (req, res, next) => {
    //ADD INPUT VALIDATION HERE
    const email = req.body.email;
    const password = req.body.password;
    
    User.findOne({email: email}, (err, user) => {
        if(err) throw err;
        if(!user) {
            res.json({success: false, msg: 'No such user'});
        } else {
            User.comparePass(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch) {
                    if(user.active) {
                        const token = jwt.sign({_id: user._id}, process.env.SECRET);
                        if(user.role == "ADMIN") {
                            res.json({
                                success: true,
                                token: token,
                                user: {
                                    id: user._id,
                                    name: user.name,
                                    email: user.email,
                                    admin: true
                                }
                            });
                        } else {
                            res.json({
                                success: true,
                                token: token,
                                user: {
                                    id: user._id,
                                    name: user.name,
                                    email: user.email,
                                    admin: false
                                }
                            });
                        }
                    } else {
                        res.json({success: false, msg: 'Account deactivated. Contact administrator at admin@admin.com'});
                    }
                } else {
                    res.json({success: false, msg: 'Invalid password'});
                }
            })
        }
    });
});

module.exports = router; 