const express = require('express');
const router = express.Router();
const fs = require('fs');
const passport = require('passport');
const data = fs.readFileSync('./Lab3-timetable-data.json', 'utf8');
const timetable = JSON.parse(data);

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

module.exports = router; 