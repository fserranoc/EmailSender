'use strict'

const express = require('express');
const UserController = require('../controllers/user');

const api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/register', UserController.SaveUser);
api.post('/login', UserController.Login);
api.put('/user/:id', md_auth.ensureAuth, UserController.UpdateUser);
api.get('/user/:id', md_auth.ensureAuth, UserController.GetUser);
api.get('/users', md_auth.ensureAuth, UserController.GetUsers);
api.delete('/user', md_auth.ensureAuth, UserController.DeleteUser);

module.exports = api;