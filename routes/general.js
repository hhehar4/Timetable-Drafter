const express = require('express');
const validator = require('validator');
const router = express.Router();
const fs = require('fs');
var stringSimilarity = require('string-similarity');
const data = fs.readFileSync('./Lab3-timetable-data.json', 'utf8');
const timetable = JSON.parse(data);

//Search for subject/course
router.get('/times/:flag/:input1?/:input2?', (req, res) => {
    let firstPass = [];
    let secondPass = [];
    let times = [];
    let checker = true;
    if(req.params.flag == "0") { //No specified subject or course
        timetable.forEach(e => {
            firstPass.push(e);
        });
        res.send(firstPass);
    } else if(req.params.flag == "1") { //Specified subject and/or course
        if(req.params.input1) {
            let input1 = validator.escape(validator.trim(req.params.input1));
            timetable.forEach(e => {
                if(String(e.subject) === input1) {
                    firstPass.push(e);
                }
            });
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
    } else if(req.params.flag == "2") { //Specified course
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

//Verify courses exist
router.get('/verify/:input1/:input2', (req, res) => {
    let firstPass = [];
    let secondPass = [];
    let times = [];
    let checker = true;
        if(req.params.input1) {
            let input1 = validator.escape(validator.trim(req.params.input1));
            timetable.forEach(e => {
                if(String(e.subject) === input1) {
                    firstPass.push(e);
                }
            });
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
    let keyword = validator.escape(validator.trim(req.params.input));
    let keywordLen = validator.isLength(keyword, 4);
    let entries = [];
    if(keywordLen) {
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

//Get public lists
router.get('/publicLists', (req, res) => {
    let savedTimetables = [];
    let timetables;
    let outList = [];
    try {
        timetables = fs.readFileSync('./timetables.json', 'utf8');
        savedTimetables = JSON.parse(timetables);
        let tenTracker = 0;
        for(let i = 0; i < savedTimetables.length; i++) {
            if(tenTracker >= 10) {
                break;
            }
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
    //ADD INPUT VALIDATION
    let uSub = req.params.subject;
    let uCrse = req.params.course;
    let savedReviews
    let outList = [];
    try {
        let reviews = fs.readFileSync('./reviews.json', 'utf8');
        savedReviews = JSON.parse(reviews);
        //Find a table that matches the email and name
        const tracker = savedReviews.find(p => ((p.subject === uSub) && (p.catalog_nbr == uCrse)));
        const index = savedReviews.findIndex(p => ((p.subject === uSub) && (p.catalog_nbr == uCrse)));
        if(tracker) {
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