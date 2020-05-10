'use strict'
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const jwt = require('../services/jwt');

function Login(req, res){
    const params = req.body;
    const {email, password, gethash} = params;

    User.findOne({email: email.toLowerCase()}, (err, user) =>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!user){
                res.status(404).send({message: 'El usuario no existe.'});
            }else{
                bcrypt.compare(password, user.password, function(err, check){
                    if(check){
                        //devolver datos usuario
                        if(gethash){
                           res.status(200).send({token: jwt.createToken(user)})
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({message: 'El usuario no existe.'});
                    }
                });
            }
        }
    })

}


function GetUser(req, res){
	var userId = req.params.id;

	User.findById(userId).exec((err, user)=>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!user){
				res.status(404).send({message: 'El usuario no existe.'});
			}else{
				res.status(200).send({user});
			}
		}
	});
}

function GetUsers(req, res){
     
	// Sacar todos los users de la bbdd
	var find = User.find({}).sort('email');

	find.exec((err, users) => {
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!users){
				res.status(404).send({message: 'No hay usuarios'});
			}else{
				res.status(200).send({users});
			}
		}
	});
}


function SaveUser(req, res){
    
    const user = new User();
    const params = req.body

    user.name = params.name;
    user.email = params.email;
    user.role = 'ROLE_USER';
    if(params.password){
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;

            if(user.name != null && user.email != null){
                user.save((err, userStored) =>{
                    if(err){
                        res.status(500).send({message: 'Error al guardar el Usuario. ' + err});
                    }else{
                        res.status(200).send({user:userStored});
                    }
                })
            }else{
                res.status(200).send({message: 'Debe completar todos los campos.'})
            }
        });
    }else{
        res.status(500).send({message: 'Introduce la contraseña'});
    }

}

function UpdateUser(req, res){
	var userId = req.params.id;
	var update = req.body;

	if(userId != req.user.sub){
	  return res.status(500).send({message: 'No tienes permiso para actualizar este usuario'});
	}

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if(err){
			res.status(500).send({message: 'Error al actualizar el usuario'});
		}else{
			if(!userUpdated){
				res.status(404).send({message: 'No se ha podido actualizar el usuario'});
			}else{
				res.status(200).send({user: userUpdated});
			}
		}
	});
}


function DeleteUser(req, res){
	var userId = req.params.id; 

	User.findByIdAndRemove(userId, (err, userRemoved)=>{
		if(err){
			res.status(500).send({message: 'Error al eliminar el usuario'});
		}else{
			if(!userRemoved){
				res.status(404).send({message: 'El usuario no ha sido eliminado'});
			}else{
                res.status(200).send({user: userRemoved});
            }
        }
      
	});
}


module.exports = {
    Login,
    GetUser,
    GetUsers,
    SaveUser,
    UpdateUser,
    DeleteUser
}