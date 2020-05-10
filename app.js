'use strict'

const express = require('express');
const bodyParser = require('body-parser');


const app = express();

//cargar rutas
const email_routes = require('./routes/email');
const user_routes = require('./routes/user');
const smtp_routes = require('./routes/smtpConfig');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//ruta base 
app.use('/api', email_routes);
app.use('/api', user_routes);
app.use('/api', smtp_routes);

module.exports = app;