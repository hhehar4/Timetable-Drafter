const express = require('express');
const validator = require('validator');
const router = express.Router();
const fs = require('fs');
var stringSimilarity = require('string-similarity');
const data = fs.readFileSync('./Lab3-timetable-data.json', 'utf8');
const timetable = JSON.parse(data);

//Search for subject/course, modified from previous lab
router.get('/times/:flag/:input1?/:input2?', (req, res) => {
    let firstPass = [];
    let secondPass = [];
    let times = [];
    let checker = true;
    if(req.params.flag == "0") { 
        //No specified subject or course
        //Send all courses
        timetable.forEach(e => {
            firstPass.push(e);
        });
        res.send(firstPass);
    } else if(req.params.flag == "1") { 
        //Specified subject and/or course
        if(req.params.input1) {
            //Validate input then get all courses with matching subject
            let input1 = validator.escape(validator.trim(req.params.input1));
            timetable.forEach(e => {
                if(String(e.subject) === input1) {
                    firstPass.push(e);
                }
            });
            //If course is specified, validate then filter the subject filtered array for matching courses
            if(req.params.input2) {
                let inputCrse = validator.escape(validator.trim(req.params.input2));
                let crseLength = validator.isLength(inputCrse, 1, 5);
                const cTracker = timetable.find(ele => (String(ele.catalog_nbr)).indexOf(inputCrse) >= 0);
                if(cTracker && crseLength) {
                    firstPass.forEach(e => {
                        if((String(e.catalog_nbr)).indexOf(inputCrse) >= 0) {
                            secondPass.push(e);
                        }
                    })
                }
                else {
                    checker = false;
                    res.status(404).send(`Specified course not found`);
                }
            }
            else {
                secondPass = firstPass;
            }
            if(checker) {
                res.send(secondPass);
            }
        }
        else {
            res.status(404).send(`Error`);
        }
    } else if(req.params.flag == "2") { 
        //Specified course
        //Validate input then filter for the specified course
        if(req.params.input1) {
            let inputCrse = validator.escape(validator.trim(req.params.input1));
            timetable.forEach(e => {
                if((String(e.catalog_nbr)).indexOf(inputCrse) >= 0) {
                    firstPass.push(e);
                }
            });
            res.send(firstPass);
        } else {  
            res.status(404).send(`Error`);
        }
    } else {  
        res.status(404).send(`Error`);
    }
});

//Verify courses exist, modified from previous lab
router.get('/verify/:input1/:input2', (req, res) => {
    let firstPass = [];
    let secondPass = [];
    let times = [];
    let checker = true;
    if(req.params.input1) {
        //Validate input then filter for subject
        let input1 = validator.escape(validator.trim(req.params.input1));
        timetable.forEach(e => {
            if(String(e.subject) === input1) {
                firstPass.push(e);
            }
        });
        //Validate input then filter the subject array for course
        if(req.params.input2) {
            let inputCrse = validator.escape(validator.trim(req.params.input2));
            let crseLength = validator.isLength(inputCrse, 1, 5);
            const cTracker = timetable.find(ele => (String(ele.catalog_nbr) === inputCrse));
            if(cTracker && crseLength) {
                firstPass.forEach(e => {
                    if((String(e.catalog_nbr) === inputCrse)) {
                        secondPass.push(e);
                    }
                })
            }
            else {
                checker = false;
                res.status(404).send(`Specified course not found`);
            }
        }
        else {
            secondPass = firstPass;
        }
        if(checker) {
            res.send(secondPass);
        }
    }
    else {
        res.status(404).send(`Error`);
    }
});

//Softmatch Search
router.get('/keyword/:input', (req, res) => {
    //Validate inputs
    let keyword = validator.escape(validator.trim(req.params.input));
    let keywordLen = validator.isLength(keyword, 4);
    let entries = [];
    //Check if valid length
    if(keywordLen) {
        //Compare keyword with course code and class name using dice coefficient, return if 50% match or higher
        timetable.forEach(e => {
            if((stringSimilarity.compareTwoStrings(keyword, String(e.catalog_nbr)) >= 0.50) || (String(e.catalog_nbr)).indexOf(keyword) >= 0) {
                entries.push(e);
            }
            const desc = e.className.split(" ");
            let tracker = true;
            desc.forEach(el => {
                if(((stringSimilarity.compareTwoStrings(keyword, String(el)) >= 0.50) || (String(el)).indexOf(keyword) >= 0) && tracker) {
                    entries.push(e);
                    tracker = false;
                }
            })
        });
        res.send(entries);
    } else {
        res.status(404).send(`Keyword too short. Must be at least 4 characters.`);
    }
});

//Get public lists, modified from previous lab
router.get('/publicLists', (req, res) => {
    let savedTimetables = [];
    let timetables;
    let outList = [];
    try {
        //Get all stored timetables
        timetables = fs.readFileSync('./timetables.json', 'utf8');
        savedTimetables = JSON.parse(timetables);
        let tenTracker = 0;
        for(let i = 0; i < savedTimetables.length; i++) {
            //Ensure only newest 10 are returned
            if(tenTracker >= 10) {
                break;
            }
            //Check if the lists are set to public
            if(savedTimetables[i].public) {
                const temp = {
                    "timetable_name": savedTimetables[i].timetable_name,
                    "creator_name": savedTimetables[i].creator_name,
                    "last_updated": savedTimetables[i].last_updated,
                    "description": savedTimetables[i].description,
                    "courses": savedTimetables[i].courses
                }
                outList.push(savedTimetables[i]);
                tenTracker++;
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

//Get all reviews for a specific course
router.get('/reviews/:subject/:course', (req, res) => {
    //Validate inputs
    let uSub = validator.escape(validator.trim(req.params.subject));
    let uCrse = validator.escape(validator.trim(req.params.course));
    let savedReviews
    let outList = [];
    try {
        //Get all stored reviews
        let reviews = fs.readFileSync('./reviews.json', 'utf8');
        savedReviews = JSON.parse(reviews);
        //Check for review with matching subject and course
        const tracker = savedReviews.find(p => ((p.subject === uSub) && (p.catalog_nbr == uCrse)));
        const index = savedReviews.findIndex(p => ((p.subject === uSub) && (p.catalog_nbr == uCrse)));
        if(tracker) {
            //Filter for all reviews which match the specified subject and course
            savedReviews.forEach(e => {
                if((String(e.subject) === String(uSub)) && (String(e.catalog_nbr) === String(uCrse))) {
                    outList.push(e);
                }
            });
            res.send(outList);
        }
    }
    catch(err) {
    }
});

module.exports = router; 