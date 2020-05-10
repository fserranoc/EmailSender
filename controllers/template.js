'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var dateFormat = require('dateformat');
var Template = require('../models/template');

function getTemplate(req, res){
	var templateId = req.params.id;

	Template.findById(templateId).populate({path: 'user'}).exec((err, template) => {
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!template){
				res.status(404).send({message: 'La plantilla no existe !!'});
			}else{
				res.status(200).send({template});
			}
		}
	});
}

function getTemplates(req, res){

    var userId = req.params.id;

    if(req.params.page){
		const page = req.params.page;
	}else{
		const page = 1;
    }
    
    const itemsPerPage = 10;

	Template.find({user: userId}).sort('creationDate').paginate(page, itemsPerPage, function(err, templates, total){
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!templates){
				res.status(404).send({message: 'No hay plantillas !!'});
			}else{
				return res.status(200).send({
					total_items: total,
					templates: templates
				});
			}
		}
	});
}

function saveTemplate(req, res){
	var template = new Template();
    const today = dateFormat(new Date(), "dd-mm-yyyy hh:MM:ss");

    var params = req.body;
    template.name = params.name;
    template.body = params.body;
    template.tags = params.tags;
    template.embebedContent = params.embebedContent;
    template.user = params.user;
    template.creationDate = today;

	template.save((err, templateStored) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!templateStored){
				res.status(404).send({message: 'No se ha guardado la plantilla'});
			}else{
				res.status(200).send({template: templateStored});
			}
		}
	});
}

function updateTemplate(req, res){
	var templateId = req.params.id;
	var update = req.body;

	Template.findByIdAndUpdate(templateId, update, (err, templateUpdated) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!templateUpdated){
				res.status(404).send({message: 'No se ha actualizado la plantilla'});
			}else{
				res.status(200).send({template: templateUpdated});
			}
		}
	});
}

function deleteTemplate(req, res){
	var templateId = req.params.id;
	
	Template.findByIdAndRemove(templateId, (err, templateRemoved) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!templateRemoved){
				res.status(404).send({message: 'No se ha borrado la plantilla'});
			}else{
				res.status(200).send({song: templateRemoved});
			}
		}
	});
}


module.exports = {
	getTemplate,
	getTemplates,
	saveTemplate,
	updateTemplate,
	deleteTemplate
};