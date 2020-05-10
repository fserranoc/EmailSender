'use strict'
const bcrypt = require('bcrypt-nodejs');
const SmtpConfig = require('../models/smtpConfig');
const jwt = require('../services/jwt');

function getSmtpConfig(req, res){
	var configId = "5eb4d1ca183d513d10f7e53d";

	SmtpConfig.findById(configId).exec((err, smtp)=>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!smtp){
				res.status(404).send({message: 'la configuración no existe.'});
			}else{
				res.status(200).send({smtp});
			}
		}
	});
}

function createSmtpConfig(req, res){

    const smtpConfig = new SmtpConfig();
    const params = req.body

    smtpConfig.host = params.host;
    smtpConfig.port = params.port;
    smtpConfig.secure = params.secure;
    smtpConfig.smtp = params.smtp;
    smtpConfig.password = params.password;

    
    if(smtpConfig.host != null && smtpConfig.port != null && smtpConfig.secure != null && smtpConfig.smtp != null && smtpConfig.password != null){

        smtpConfig.save((err, smtpConfigStored) =>{
            if(err){
                res.status(500).send({message: 'Error al crear la configuración. ' + err});
            }else{
                res.status(200).send({smtpConfig: smtpConfigStored});
            }
        });
    }else{
        res.status(200).send({message: 'Debe completar todos los campos.'})
    }
}

function updateSmtpConfig(req, res){
	var configId = req.params.id;
    var update = req.body;
    
	SmtpConfig.findByIdAndUpdate(configId, update, (err, smtpConfigUpdated) => {
		if(err){
			res.status(500).send({message: 'Error al actualizar los datos'});
		}else{
			if(!smtpConfigUpdated){
				res.status(404).send({message: 'No se han podido actualizar los datos'});
			}else{
				res.status(200).send({smtp: smtpConfigUpdated});
			}
		}
	});
}


module.exports = {
    getSmtpConfig,
    createSmtpConfig,
    updateSmtpConfig
}