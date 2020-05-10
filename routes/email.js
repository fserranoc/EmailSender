'use strict'

const express = require('express');
const EmailController = require('../controllers/email');

const api = express.Router();

api.post('/send', EmailController.ProcessingEmail);
api.get('/test', EmailController.test);

module.exports = api;