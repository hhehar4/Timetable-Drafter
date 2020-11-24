const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const validator = require('validator');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const passport = require('passport');

dotenv.config();

mongoose.connect(
    process.env.DB,
    {useNewUrlParser: true,
    useUnifiedTopology: true},
    () => console.log('connected to db') 
);

const users = require('./routes/users');
const general = require('./routes/general');
const secure = require('./routes/secure');
const admin = require('./routes/admin');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use(cors());

app.use('/', express.static(__dirname + '/MyApp/src')); 

app.use('/users', users);
app.use('/general', general);
app.use('/secure', secure);
app.use('/admin', admin);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});