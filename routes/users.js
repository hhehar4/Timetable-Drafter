const express = require('express');
const router = express.Router();
const User = require('../models/User');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { default: validator } = require('validator');

dotenv.config();

//Register user
router.post('/register', (req, res, next) => {
    //Validate inputs
    if(validator.isEmail(validator.trim(req.body.email))) {
        const email = validator.trim(req.body.email);
        let uName = validator.trim(req.params.name);
        uName = uName.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        const user = new User({
            name: uName,
            email: email,
            password: validator.escape(validator.trim(req.body.password)),
            role: "USER",
            active: true
        });
        
        //Check if email already exists
        User.findOne({email: email}, (err, userCheck) => {
            if(err) throw err;
            if(!userCheck) {
                //Add user to DB is email is not already in use
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
    } else {
        res.json({success: false, msg: 'Not a valid email'});
    }
});

//Authenticate user login
router.post('/authenticate', (req, res, next) => {
    //Validate inputs
    if(validator.isEmail(validator.trim(req.body.email))) {
        const email = validator.trim(req.body.email);
        const password = validator.escape(validator.trim(req.body.password));
        
        //Look for email within DB
        User.findOne({email: email}, (err, user) => {
            if(err) throw err;
            if(!user) {
                res.json({success: false, msg: 'No such user'});
            } else {
                //If found, compare entered pass with user pass
                User.comparePass(password, user.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch) {
                        //Return the jwt token and user info is matched passwords and account active
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
    }
});

module.exports = router; 