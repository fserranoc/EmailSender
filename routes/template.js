'use strict'

const express = require('express');
const TemplateController = require('../controllers/template');

const api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/template/:id', md_auth.ensureAuth, TemplateController.getTemplate);
api.get('/templates/:userId', md_auth.ensureAuth, TemplateController.getTemplates);
api.post('/template', md_auth.ensureAuth, TemplateController.saveTemplate);
api.update('/template/:id', md_auth.ensureAuth, TemplateController.updateTemplate);
api.delete('/template/:id', md_auth.ensureAuth, TemplateController.deleteTemplate);

module.exports = api;