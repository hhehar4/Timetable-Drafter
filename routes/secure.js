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

//Get personal lists
router.get('/myLists/:email', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    //ADD INPUT VALIDATION
    let uEmail = req.params.email;
    let savedTimetables = [];
    let timetables;
    let outList = [];
    try {
        timetables = fs.readFileSync('./timetables.json', 'utf8');
        savedTimetables = JSON.parse(timetables);
        for(let i = 0; i < savedTimetables.length; i++) {
            if(savedTimetables[i].creator_email == uEmail) {
                const temp = {
                    "timetable_name": savedTimetables[i].timetable_name,
                    "creator_name": savedTimetables[i].creator_name,
                    "last_updated": savedTimetables[i].last_updated,
                    "description": savedTimetables[i].description,
                    "courses": savedTimetables[i].courses
                }
                outList.push(savedTimetables[i]);
            } 
            else {
                continue;
            }
        }
        res.send(outList);
    }
    catch(err) {
        res.status(404).send(`No timetables exist`);
    }
});

//Edit timetables
router.put('/updateTimetables/:name/:token', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    //Verify user using jwt token
    let uId = jwt.verify(req.params.token, process.env.SECRET)._id;
    let uEmail = "";
    User.findOne({_id: uId}, (err, user) => {
        if(err) throw err;
        if(user) {
            uEmail = user.email;
            //ADD INPUT VALIDATION
            let originalName = req.params.name;
            let newItem = req.body;
            let newName = validator.trim(String(newItem.timetable_name));
            newName = newName.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
            newItem.timetable_name = newName;
            let newDes = validator.trim(String(newItem.description));
            newDes = newDes.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
            newItem.description = newDes;
            let savedTimetables;
            let timetables;
            try {
                timetables = fs.readFileSync('./timetables.json', 'utf8');
                savedTimetables = JSON.parse(timetables);
                //Find a table that matches the email and original name
                let schName = validator.trim(originalName);
                schName = schName.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
                const tracker = savedTimetables.find(p => ((p.timetable_name === schName) && (p.creator_email == uEmail)));
                const index = savedTimetables.findIndex(p => ((p.timetable_name === schName) && (p.creator_email == uEmail)));
                //Check for valid courses
                if(tracker) {
                    let courseChecker = true;
                    newItem.courses.forEach(e => {
                        let sub = validator.escape(validator.trim(String(e.subject)));
                        let crse = validator.escape(validator.trim(String(e.catalog_nbr)));
                        const sTracker = timetable.find(ele => String(ele.subject) === sub);
                        const cTracker = timetable.find(ele => String(ele.catalog_nbr) === crse);
                        if(!(sTracker && cTracker)) {
                            courseChecker = false;
                        }
                    })
                    //Remove duplicates
                    if(courseChecker) {
                        let dupRemove = [];
                        newItem.courses.forEach(e => {
                            let subE = validator.escape(validator.trim(String(e.subject)));
                            let crseE = validator.escape(validator.trim(String(e.catalog_nbr)));
                            const sCheck = dupRemove.find(p => p.subject === subE);
                            const cCheck = dupRemove.find(p => p.catalog_nbr === crseE);
                            if(!(sCheck && cCheck)) {
                                dupRemove.push(e);
                            }
                        })
                        newItem.courses = dupRemove;
                        currDate = new Date();
                        newItem.last_updated = currDate.toString();
                        savedTimetables.splice(index, 1);
                        savedTimetables.unshift(newItem);
                        //Update table
                        fs.writeFile('timetables.json', JSON.stringify(savedTimetables), function (err) {
                            if (err) throw err;
                            }); 
                        res.status(204).send(`Timetable Updated`);
                    }
                    else {
                        res.status(404).send(`One or more subjects or courses do not exist`);
                    }
                }
                else {
                    res.status(404).send(`Timetable ${schName} was not found`);
                }
            }
            catch(err) {
            }
        }
    });
});

//Create timetable
router.post('/createTimetables/:token', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    //Verify user using jwt token
    let uId = jwt.verify(req.params.token, process.env.SECRET)._id;
    let uEmail = "";
    User.findOne({_id: uId}, (err, user) => {
        if(err) throw err;
        if(user) {
            uEmail = user.email;
            //ADD INPUT VALIDATION
            let newItem = req.body;
            let newName = validator.trim(String(newItem.timetable_name));
            newName = newName.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
            newItem.timetable_name = newName;
            let newDes = validator.trim(String(newItem.description));
            newDes = newDes.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
            newItem.description = newDes;
            let savedTimetables;
            let timetables;
            try {
                timetables = fs.readFileSync('./timetables.json', 'utf8');
                savedTimetables = JSON.parse(timetables);
                let timetableCount = 0;
                //Check how many tables currently exist for this account
                savedTimetables.forEach(p => {
                    if(p.creator_email == uEmail) {
                        timetableCount++;
                    }
                })
                //Check for valid courses
                if(timetableCount < 20) {
                    let courseChecker = true;
                    newItem.courses.forEach(e => {
                        let sub = validator.escape(validator.trim(String(e.subject)));
                        let crse = validator.escape(validator.trim(String(e.catalog_nbr)));
                        const sTracker = timetable.find(ele => String(ele.subject) === sub);
                        const cTracker = timetable.find(ele => String(ele.catalog_nbr) === crse);
                        if(!(sTracker && cTracker)) {
                            courseChecker = false;
                        }
                    })
                    //Remove duplicates
                    if(courseChecker) {
                        let dupRemove = [];
                        newItem.courses.forEach(e => {
                            let subE = validator.escape(validator.trim(String(e.subject)));
                            let crseE = validator.escape(validator.trim(String(e.catalog_nbr)));
                            const sCheck = dupRemove.find(p => p.subject === subE);
                            const cCheck = dupRemove.find(p => p.catalog_nbr === crseE);
                            if(!(sCheck && cCheck)) {
                                dupRemove.push(e);
                            }
                        })
                        newItem.courses = dupRemove;
                        currDate = new Date();
                        newItem.last_updated = currDate.toString();
                        savedTimetables.unshift(newItem);
                        //Update table
                        fs.writeFile('timetables.json', JSON.stringify(savedTimetables), function (err) {
                            if (err) throw err;
                        }); 
                        res.status(204).send(`Timetable Added`);
                    }
                    else {
                        res.status(404).send(`One or more subjects or courses do not exist`);
                    }
                }
                else {
                    res.status(404).send(`User already has 20 tables`);
                }
            }
            catch(err) {
            }
        }
    });
});

//Delete table
router.delete('/deleteTable/:name/:token', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    //Verify user using jwt token
    let uId = jwt.verify(req.params.token, process.env.SECRET)._id;
    let uEmail = "";
    User.findOne({_id: uId}, (err, user) => {
        if(err) throw err;
        if(user) {
            uEmail = user.email;
            let savedTimetables;
            try {
                timetables = fs.readFileSync('./timetables.json', 'utf8');
                savedTimetables = JSON.parse(timetables);
                //Find a table that matches the email and name
                let schName = validator.trim(req.params.name);
                schName = schName.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
                const tracker = savedTimetables.find(p => ((p.timetable_name === schName) && (p.creator_email == uEmail)));
                const index = savedTimetables.findIndex(p => ((p.timetable_name === schName) && (p.creator_email == uEmail)));
                if(tracker) {
                    savedTimetables.splice(index, 1);
                    //Remove table
                    fs.writeFile('timetables.json', JSON.stringify(savedTimetables), function (err) {
                        if (err) throw err;
                    }); 
                    res.status(204).send(`Successfully removed`);
                }
            }
            catch(err) {
            }
        }
    });
});

//Add review
router.post('/addReview/:token', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    //Verify user using jwt token
    let uId = jwt.verify(req.params.token, process.env.SECRET)._id;
    let data = req.body;
    User.findOne({_id: uId}, (err, user) => {
        if(err) throw err;
        if(user) {
            let savedReviews;
            try {
                let ratings = [1, 2, 3, 4, 5];
                let reviews = fs.readFileSync('./reviews.json', 'utf8');
                savedReviews = JSON.parse(reviews);
                const sTracker = timetable.find(ele => String(ele.subject) === data.subject);
                const cTracker = timetable.find(ele => String(ele.catalog_nbr) === data.catalog_nbr);
                let rating;
                try{
                    rating = ratings.find(e => e == parseInt(data.rating, 10));
                    if(sTracker && cTracker && rating) {
                        let currDate = new Date();
                        let out = {
                            "author": user.name,
                            "date": currDate.toString(),
                            "review": validator.escape(validator.trim(String(data.review))),
                            "rating": rating,
                            "subject": validator.escape(validator.trim(String(data.subject)).toUpperCase()),
                            "catalog_nbr": validator.escape(validator.trim(String(data.catalog_nbr)).toUpperCase()),
                            "hidden" : false
                        }
                        savedReviews.push(out);
                        fs.writeFile('reviews.json', JSON.stringify(savedReviews), function (err) {
                            if (err) throw err;
                        }); 
                        res.status(204).send(`Successfully added`);
                    } else {
                        res.status(404).send(`Invalid entries`);
                    }
                }
                catch {}
            }
            catch(err) {
            }
        }
    });
});

module.exports = router; 