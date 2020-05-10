'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TemplateSchema = Schema({
    name: String,
    body: String,
    tags: [{key:String}],
    embebedContent:[
        {
            filename: String,          
            contentType: String,
            cid: String
        }
    ],
    user: {type: Schema.ObjectId},
    creationDate: Date   
});

module.exports = mongoose.model('Template', TemplateSchema);