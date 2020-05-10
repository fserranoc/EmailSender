'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SmtpConfigSchema = Schema({
    host: String,
    port: Number,
    secure: Boolean,
    user: String,
    password: String,
});

module.exports = mongoose.model('SmtpConfig', SmtpConfigSchema);