'use strict'

const express = require('express');
const SmtpConfigController = require('../controllers/smtpConfig');

const api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/smtp-config', md_auth.ensureAuth, SmtpConfigController.createSmtpConfig);
api.get('/smtp-config', md_auth.ensureAuth, SmtpConfigController.getSmtpConfig);
api.put('/smtp-config/:id', md_auth.ensureAuth, SmtpConfigController.updateSmtpConfig);

module.exports = api;