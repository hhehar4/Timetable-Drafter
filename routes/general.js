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
    } else if(req.params.flag == "2") {
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

//Softmatch Search
router.get('/keyword/:input', (req, res) => {
    let keyword = validator.escape(validator.trim(req.params.input));
    let keywordLen = validator.isLength(keyword, 4);
    let entries = [];
    
    timetable.forEach(e => {
        if((stringSimilarity.compareTwoStrings(keyword, String(e.catalog_nbr)) >= 0.6) || (stringSimilarity.compareTwoStrings(keyword, String(e.className)) >= 0.6) || (String(e.catalog_nbr)).indexOf(keyword) >= 0 || (String(e.className)).indexOf(keyword) >= 0) {
            entries.push(e);
        }
    });

    res.send(entries);
});

module.exports = router; 