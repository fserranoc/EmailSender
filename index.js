//conexion con BD
'use strict'
var app = require('./app');
var port = process.env.PORT || 3977;


var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(
    "mongodb+srv://fserranoc:hwxFmLQKuqSRwqPP@dbcluster-wisml.mongodb.net/email-sender?retryWrites=true", 
    { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if(err){
        throw err;
    }else{
        console.log("la bd esta OK");
    }
});



console.log("Welcome to Email Sender");
app.listen(port, function(){
    console.log("Servidor de email sender escuchando en http://localhost:"+port);    
});