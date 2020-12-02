const express = require('express');
const validator = require('validator');
const User = require('../models/User');
const router = express.Router();
const fs = require('fs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const data = fs.readFileSync('./Lab3-timetable-data.json', 'utf8');
const timetable = JSON.parse(data);

dotenv.config();

//Get users
router.get('/getUsers/:token', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    //Verify user using jwt token
    let uId = jwt.verify(req.params.token, process.env.SECRET)._id;
    //Find the user who sent the request
    User.findOne({_id: uId}, (err, user) => {
        if(err) throw err;
        //Check if that user has admin privileges
        if(String(user.role) == "ADMIN") {
            //Get all users who are not the user who sent the request
            User.find({_id: { $ne: uId }}, (err, users) => {
                let out = [];
                users.forEach(e => {
                    out.push({
                        "name": e.name,
                        "email": e.email,
                        "role": e.role,
                        "active": e.active,
                    });
                })
                //Return an array of all other users
                res.send(out);
            });
        } else {
            res.status(401).send(`User does not have access`);
        }
        
    });
});

//Toggle user accounts from active/deactive
router.put('/toggleUserStatus/:token', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    let selectedUser = req.body;
    //Verify user using jwt token
    let uId = jwt.verify(req.params.token, process.env.SECRET)._id;
    //Find the user who sent the request
    User.findOne({_id: uId}, (err, admin) => {
        if(err) throw err;
        //Check if that user has admin privileges 
        if(String(admin.role) == "ADMIN") {
            //Validate the data sent to backend to check if it is an email
            if(validator.isEmail(selectedUser.email)) {
                //Look for email within the users DB
                User.findOne({email: selectedUser.email}, (err, user) => {
                    //Toggle the active status of the user if found
                    user.active = !user.active;
                    user.save(function (err) {
                        if (err) return handleError(err);
                    });
                    res.status(200).send(user);
                });
            }
            else {
                res.status(401).send(`No user specified`);
            }
        } else {
            res.status(401).send(`User does not have access`);
        }
        
    });
});

//Assign admin to users
router.put('/assignAdmin/:token', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    let selectedUser = req.body;
    //Verify user using jwt token
    let uId = jwt.verify(req.params.token, process.env.SECRET)._id;
    //Find the user who sent the request
    User.findOne({_id: uId}, (err, admin) => {
        if(err) throw err;
        //Check if that user has admin privileges
        if(String(admin.role) == "ADMIN") {
            //Validate the data sent to backend to check if it is an email
            if(validator.isEmail(selectedUser.email)) {
                //Look for email within the users DB
                User.findOne({email: selectedUser.email}, (err, user) => {
                    //Change the user role to administrator to grant admin privileges
                    user.role = "ADMIN";
                    user.save(function (err) {
                        if (err) return handleError(err);
                    });
                    res.status(200).send(user);
                });
            } else {
                res.status(401).send(`No user specified`);
            }
        } else {
            res.status(401).send(`User does not have access`);
        }
        
    });
});

//Get reviews
router.get('/getReviews/:token', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    //Verify user using jwt token
    let uId = jwt.verify(req.params.token, process.env.SECRET)._id;
    //Find the user who sent the request
    User.findOne({_id: uId}, (err, user) => {
        if(err) throw err;
        //Check if that user has admin privileges
        if(String(user.role) == "ADMIN") {
            //Get all stored reviews and return them
            try {
                let reviews = fs.readFileSync('./reviews.json', 'utf8');
                let savedReviews = JSON.parse(reviews);
                res.send(savedReviews);
            }
            catch(err) {
                res.status(404).send(`No reviews exist`);
            }
        } else {
            res.status(401).send(`User does not have access`);
        }
    });
});

//Toggle reviews from hidden/visible
router.put('/toggleReviewStatus/:token', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    let selectedReview = req.body;
    //Verify user using jwt token
    let uId = jwt.verify(req.params.token, process.env.SECRET)._id;
    //Find the user who sent the request
    User.findOne({_id: uId}, (err, admin) => {
        if(err) throw err;
        //Check if that user has admin privileges
        if(String(admin.role) == "ADMIN") {
            try {
                //Get all reviews
                let reviews = fs.readFileSync('./reviews.json', 'utf8');
                let savedReviews = JSON.parse(reviews);
                //Look for a review with matching author and date
                const tracker = savedReviews.find(p => ((p.author === String(selectedReview.author)) && (p.date == selectedReview.date)));
                const index = savedReviews.findIndex(p => ((p.author === String(selectedReview.author)) && (p.date == selectedReview.date)));
                //If found, toggle the hidden property of the review
                if(tracker) {
                    savedReviews[index].hidden = !savedReviews[index].hidden;
                    fs.writeFile('reviews.json', JSON.stringify(savedReviews), function (err) {
                        if (err) throw err;
                    }); 
                    res.send(savedReviews[index]);
                } else {
                    res.status(404).send(`Reviews not found`);
                }
            }
            catch(err) {
                res.status(404).send(`No reviews exist`);
            }
        } else {
            res.status(401).send(`User does not have access`);
        }
        
    });
});

module.exports = router; 