'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EmailSchema = Schema({
    from: String,
    to: String,
    cc: String,
    bcc: String,
    subject: String,
    message: String,
    isHtmlTemplate: Boolean,
    attachments: String,
    date: Date,
    status: String,
    messageId: String,
    log:String,
    templateName: String,
    body: String,
    user: {type: Schema.ObjectId}    
});

module.exports = mongoose.model('Email', EmailSchema);