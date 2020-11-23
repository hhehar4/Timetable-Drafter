const express = require('express');
const router = express.Router();

router.get('/register', (req, res, next) => {
    res.send("register");
});

router.get('/authenticate', (req, res, next) => {
    res.send("authenticate");
});

router.get('/profile', (req, res, next) => {
    res.send("profile");
});

router.get('/validate', (req, res, next) => {
    res.send("validate");
});

module.exports = router;