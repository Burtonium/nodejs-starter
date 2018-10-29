require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const routes = require('./routes');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static('public'));

app.post('/register', routes.register);
app.get('/activate/:token', routes.activate);
app.post('/login', routes.login);


app.listen(port, () => console.log(`Example app listening on port ${port}`));