const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const validator = require('validator');
const cors = require('cors');
const mongoose = require('mongoose');

const users = require('./routes/users');

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(cors());

app.use('/users', users);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});