// Code : 
// 0 : OK
// 1 : missing params
// 2 : sequelize error
// 3 : not found, wrong pwd, ...
// 4 : Unorized
// 5 : account not validated 
// 6 : no token /token invalid

module.exports = function(app, models, TokenUtils, utils, urlApi) {

    var bcrypt = require("bcrypt-nodejs");
    var jwt    = require('jsonwebtoken');
 

	//CREATE USER
    app.post("/user", function(req, res, next) {
        if (req.body.loginUser &&  req.body.emailUser && req.body.passwordUser) {
            var requestVerifyLogin = {
                where: {
                    loginUser : req.body.loginUser
                }
            };
            var User = models.User;

            User.find(requestVerifyLogin).then(function(result) {
                if(result){
                    res.json({
                        "code" : 4,
                        "message" : "login already used"
                    });
                }else{
                   
                    var CryptoUtils = utils.CryptoUtils;
                    var crpt = new CryptoUtils();
                    var FinderUtils = utils.FinderUtils;
                    FinderUtils.CheckEmailUser(req.body.emailUser).then(function(result) {  
                       if(result == null){
                            var id = null;
                            if(req.body.idUser){
                                id = req.body.idUser;
                            }
                            var salt = utils.OtherUtils.GenerateCode(50);
                            var validationCodeUser = utils.OtherUtils.GenerateCode(256);
                            var pwdSalty = req.body.passwordUser + salt;

                            User.create({
                                "idUser" : id,
                                "loginUser" : req.body.loginUser,
                                "emailUser" : crpt.encryptAES(req.body.emailUser),
                                "passwordUser" : bcrypt.hashSync(pwdSalty, null, null),
                                "saltUser" : salt,
                                "mailValidationUser" : false,
                                "validationCodeUser" : validationCodeUser,
                                "typeUser" : 3
                            }).then(function(result){
                                
                                var SendMailUtils = utils.SendMailUtils;
                                var myMail = new SendMailUtils();
                                myMail.sendMail(req.body.emailUser,"Validation Inscription", "Votre inscription à bien été prise en compte. Afin de valider votre inscription merci de suivre le lien suivant : " +urlApi+"/registrationValidation/" +validationCodeUser);
                                
                                res.json({
                                    "code" : 0,
                                    "loginUser" : result.loginUser,
                                    "emailUser" : result.emailUser
                                });
                            }).catch(function(err){
                                console.log(err)
                                res.json({
                                    "code" : 2,
                                    "message" : "Sequelize error",
                                    "error" : err
                                });
                            });
                       }else{
                            res.json({
                                "code" : 5,
                                "message" : "email already used"
                            });
                       }
                    })    
                }

            }).catch(function(err){
                console.log(err)
                res.json({
                    "code" : 2,
                    "message" : "Sequelize error",
                    "error" : err
                });
            });
        } else {
            res.json({
                "code" : 1,
                "message" : "Missing required parameters"
            });
        }
    });

	//GET ALL USER
    /*app.get("/users", function(req, res, next) {
        
        var User = models.User;
        var request = {
            attributes: ["loginUser", "emailUser", "typeUser"],  
        };
        User.findAll(request).then(function(result){
            if(result){
                res.json(result);
            }else{
                res.json({
                    "code" : 3,
                    "message" : "User not found"
                });
            }
        });
    
    });*/

	//pas fini
	//GET USER BY ID
    app.get("/user/findById", function(req, res, next) {
        if (req.body.idUser){
            var User = models.User;
            var request = {
                where: {
                    idUser : req.body.idUser
                }
            };
            User.find(request).then(function(result) {
                if (result){
                    res.json({
                        "code" : 0,
                        "loginUser" : result.loginUser
                    });
                } else {
                    res.json({
                        "code" : 3,
                        "message" : "User not found"
                    });
                }
            });
        } else {
            res.json({
                "code" : 1,
                "message" : "Missing required parameters"
            });
        }
    });
    
    app.get("/user/findForValidation", function(req, res, next) {
        if (req.body.validationCodeUser){
            var User = models.User;
            var request = {
                where: {
                    validationCodeUser : req.body.validationCodeUser
                }
            };
            User.find(request).then(function(result) {
                if (result){
                    var loginUser = result.loginUser;
                    var attributes = {};
                    attributes.mailValidationUser = true;
                    attributes.validationCodeUser = "";
                    var request2 = {
                        where: {
                            loginUser : loginUser
                        }
                    };
                    User.update(attributes, request2).then(function (results) {
                        res.json({
                            "code":0,
                            "message":"Validated user account"
                        });
                    }).catch(function (err) {
                        res.json({
                            "code": 2,
                            "message": "Sequelize error",
                            "error": err
                        });
                    });

                } else {
                    res.json({
                        "code" : 3,
                        "message" : "User not found"
                    });
                }
            });
        } else {
            res.json({
                "code" : 1,
                "message" : "Missing required parameters"
            });
        }
    });
	    //On récupère les infos persos
	   app.get("/user/find", function (req, res, next) {
        if (req.body.loginUser) {
            var User = models.User;
            var request = {
                attributes: ["loginUser", "passwordUser", "emailUser", "typeUser"],
                where: {
                    loginUser: req.body.loginUser
                }
            };
            User.find(request).then(function (result) {
                if (result) {
                    res.json({
                        "code": 0,
                        "idUser": result.idUser,
                        "loginUser": result.loginUser,
                        "emailUser": result.emailUser,
                        "typeUser": result.typeUser
                    });
                } else {
                    res.json({
                        "code": 3,
                        "message": "User not found"
                    });
                }
            });
        } else {
            res.json({
                "code": 1,
                "message": "Missing required parameters"
            });
        }
    });
	
	//GET USER BY Login (pour vérifier si il existe)
    app.get("/user/findByLogin", function(req, res, next) {
        if (req.body.loginUser){
            var User = models.User;
            var request = {
                where: {
                    loginUser : req.body.loginUser
                }
            };
            User.find(request).then(function(result) {
                if (result){
                    res.json({
                        "code" : 0,
                        "loginUser" : result.loginUser,
                    });
                } else {
                    res.json({
                        "code" : 3,
                        "message" : "User not found with this login"
                    });
                }
            });
        } else {
            res.json({
                "code" : 1,
                "message" : "Missing required parameters"
            });
        }
    });


   

    app.get("/user/checkValidate", function(req, res, next) {
        if (req.body.loginUser){
            var User = models.User;
            var request = {
                where: {
                    loginUser : req.body.loginUser
                }
            };
            User.find(request).then(function(result) {
                if (result){          
                    if(result.mailValidationUser == false){
                        res.json({
                            "code" : 5,
                            "message" : "User account not validated"
                        });
                    }else{
                        res.json({
                            "code" : 0,   
                        });
                    }
                    
                } else {
                    res.json({
                        "code" : 3,
                        "message" : "User not found with this login"
                    });
                }
            });
        } else {
            res.json({
                "code" : 1,
                "message" : "Missing required parameters"
            });
        }
    });

	//
    app.post("/user/auth", function(req, res, next) {
        if (req.body.loginUser && req.body.passwordUser) {
            var User = models.User;
            var request = {
                attributes: ["idUser", "loginUser", "passwordUser", "emailUser", "typeUser", "saltUser"],
                where: {
                    loginUser : req.body.loginUser
                }
            };
            User.find(request).then(function(result){
                if(result){
                    
                    if(bcrypt.compareSync(req.body.passwordUser+result.saltUser, result.passwordUser)){
                        var payload = {
                            admin: result.typeUser,
                            id: result.idUser
                        };
                        var token = jwt.sign(payload, "kukjhifksd489745dsf87d79+62dsfAD_-=", {
                            expiresIn : 60*60*24
                        });
                       

                        res.json({
                            "code" : 0,
                            "loginUser" : result.loginUser,
                            "emailUser" : result.emailUser,
                            "typeUser" : result.typeUser,
                            "token" : token
                        });
                    }else{
                        res.json({
                            "code" : 3,
                            "message" : "Wrong pwd"
                        });
                    }
                }else{
                    res.json({
                        "code" : 3,
                        "message" : "User not found"
                    });
                }
            }).catch(function(err){
                res.json({
                    "code" : 2,
                    "message" : "Sequelize error",
                    "error" : err
                });
            });
        } else {
            res.json({
                "code" : 1,
                "message" : "Missing required parameters"
            });
        }
    });
	
    app.delete("/deleteUser/:id", function (req, res, next) {  
        var User = models.User;
   
        if (req.params.id) {
            var request = {
                where: {
                    idUser : req.params.id
                }
            };
            User.find({where: {idUser : req.params.id}}).then(function(result){
                if(result){
                    result.destroy().then(function(success){
                        if(success){
                            res.json({
                                "code" : 0,
                                "message":"user deleted"
                            });
                        }else{
                            res.json({
                                "code" : 2,
                                "message" : "Sequelize error",
                                "error" : err
                            });
                        }
                    }).catch(function(err){
                        le.log(err);
                    });
                }else{
                    res.json({
                        "code" : 3,
                        "message" : "User not found"
                    });
                }               
        
              });          
        }
    });



    app.get("/user/findAddress", function (req, res, next) {
        if(req.body.token && req.body.loginUser){ 
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {       
                if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token"
                    });
                } else {   
                    var User = models.User;
                    var request = {
                        where: {
                            loginUser : req.body.loginUser
                        }
                    };
                    var CryptoUtils = utils.CryptoUtils;
                    var crpt = new CryptoUtils();
                    
                    User.find(request).then(function(result) { 
                        if(result){   
                            //si un champ null : aucune adresse préenregistrée
                            if(result.lastNameUser == null){
                                res.json({
                                    "code" : 0,
                                    "lastNameUser" : null,
                                    "firstNameUser" : null,
                                    "sexUser" : null,
                                    "addressUser" : null,
                                    "cityUser" : null,
                                    "cpUser" : null
                                })
                            }else{
                                res.json({
                                    "code" : 0,
                                    "lastNameUser" : crpt.decryptAES(result.lastNameUser),
                                    "firstNameUser" : crpt.decryptAES(result.firstNameUser),
                                    "sexUser" : crpt.decryptAES(result.sexUser),
                                    "addressUser" : crpt.decryptAES(result.addressUser),
                                    "cityUser" : crpt.decryptAES(result.cityUser),
                                    "cpUser" : crpt.decryptAES(result.cpUser)
                                })
                            }

                            
                        }else{
                            res.json({
                                "code": 3,
                                "message": "User not found"
                            });
                        }
                    }).catch(function (err) {
                        //console.log(err)
                        res.json({
                            "code": 2,
                            "message": "Sequelize error",
                            "error": err
                        });
                    });  
                }  
            }).catch(function (err) {
                //console.log(err)
                res.json({
                    "code": 2,
                    "message": "Sequelize error",
                    "error": err
                });
            });         
        }else{
            res.json({
                "code" : 1,
                "message" : "Missing required parameters"
            });
        }
    })


    app.post("/user/update", function (req, res, next) {


        if(!req.body.token && !req.body.code){
            res.json({
                "code" : 6,
                "message" : "Missing token"
            });
        }else if(req.body.token){

            // verifies secret and checks exp
            
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {       
                if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token"
                    });
                    
                } else {             
                    if(req.body.loginUser){
                        var request = {
                            "where": {
                                loginUser: req.body.loginUser
                            }
                        };
                
                        var attributes = {};
                        if (req.body.emailUser) {
                            attributes.emailUser = req.body.emailUser;
                        }
                        if (req.body.passwordUser && req.body.saltUser) {
                            attributes.passwordUser = req.body.passwordUser;
                            attributes.saltUser = req.body.saltUser;
                        }
                        
                        if (req.body.firstNameUser && req.body.lastNameUser && req.body.sexUser && req.body.addressUser && req.body.cityUser && req.body.cpUser) {
                            attributes.firstNameUser = req.body.firstNameUser;
                            attributes.lastNameUser = req.body.lastNameUser;
                            attributes.sexUser = req.body.sexUser;
                            attributes.addressUser = req.body.addressUser;
                            attributes.cityUser = req.body.cityUser;
                            attributes.cpUser = req.body.cpUser;
                        }
            
                        var User = models.User;
                        User.update(attributes, request).then(function (results) {
                            res.json({
                                "code":0,
                                "message":"User updated"
                            });
                        }).catch(function (err) {
                           
                            res.json({
                                "code": 2,
                                "message": "Sequelize error",
                                "error": err
                            });
                        });
                    }else{
                        res.json({
                            "code" : 1,
                            "message" : "Missing required parameters"
                        });
                    }
                }
            }).catch(function (err) {
                res.json({
                    "code": 2,
                    "message": "Sequelize error",
                    "error": err
                });
            })  ;      
        }
        //Pour reset pwd
        else{
            var request = {
                "where": {
                    codeResetPasswordUser: req.body.code
                }
            };

            var attributes = {};
            if (req.body.passwordUser) {
                var salt = utils.OtherUtils.GenerateCode(50);
                var pwdSalty = req.body.passwordUser + salt;
                attributes.passwordUser = bcrypt.hashSync(pwdSalty, null, null),
                attributes.saltUser = salt;
                attributes.codeResetPasswordUser = null;
            }
            var User = models.User;
            User.update(attributes, request).then(function (results) {
                res.json({
                    "code":0,
                    "message":"User updated"
                });
            }).catch(function (err) {
               
                res.json({
                    "code": 2,
                    "message": "Sequelize error",
                    "error": err
                });
            });
        }
    
    });


     //On récupère les infos persos
     app.get("/user/resend", function (req, res, next) {
        var code ="";
        if (req.body.emailUser) {
            var User = models.User;
            var request = {
                attributes: ["loginUser", "emailUser", "mailValidationUser", "validationCodeUser"],
                where: {
                    loginUser: req.body.loginUser
                }
            };
            User.find(request).then(function (result) {
                if (result) {
                    if(result.mailValidationUser == 1){
                        res.json({
                            "code" : 5,
                            "message" : "account is already validate"   
                        })
                    }else{
                        code = result.validationCodeUser


                        var SendMailUtils = utils.SendMailUtils;
                        var myMail = new SendMailUtils();
                        //on change le mail si différent
                        var CryptoUtils = utils.CryptoUtils;
                        var crpt = new CryptoUtils();

                        if(crpt.decryptAES(result.emailUser) != req.body.emailUser){
                            //on vérifie que l'email n'est pas déjà utilisé
                            var FinderUtils = utils.FinderUtils;
                            FinderUtils.CheckEmailUser(req.body.emailUser).then(function(result) {  
                                if(result){
                                    res.json({
                                        "code": 4,
                                        "message": "email already used",
                                    });
                                }else{
                                    var attributes = {};
                                    attributes.emailUser = crpt.encryptAES(req.body.emailUser);
                                    var User = models.User;

                                    User.update(attributes, request).then(function(results){
                                        myMail.sendMail(req.body.emailUser,"Validation Inscription", "Votre inscription à bien été prise en compte. Afin de valider votre inscription merci de suivre le lien suivant : " +urlApi+"/registrationValidation/" +result.validationCodeUser );
                                        res.json({
                                            "code": 0,
                                            "message": "ok"   
                                        });
                                    }).catch(function (err) {
                                        res.json({
                                            "code": 2,
                                            "message": "Sequelize error",
                                            "error": err
                                        });
                                    });  
                                }
                            }).catch(function (err) {
                                res.json({
                                    "code": 2,
                                    "message": "Sequelize error",
                                    "error": err
                                });
                            });
                        }else{
                            myMail.sendMail(req.body.emailUser,"Validation Inscription", "Votre inscription à bien été prise en compte. Afin de valider votre inscription merci de suivre le lien suivant : " +urlApi+"/registrationValidation/" +result.validationCodeUser );     
                            res.json({
                                "code": 0,
                                "message": "ok"      
                            });
                        }
                    }
                } else {
                    res.json({
                        "code": 3,
                        "message": "User not found"
                    });
                }
            }).catch(function (err) {
                
                res.json({
                    "code": 2,
                    "message": "Sequelize error",
                    "error": err
                });
            });
        } else {
            res.json({
                "code": 1,
                "message": "Missing required parameters"
            });
        }
    });


    //On enregistre la demande de reset
    app.post("/user/resetPassword", function (req, res, next) {

        if (req.body.emailUser) {
            
            var FinderUtils = utils.FinderUtils;
            FinderUtils.CheckEmailUser(req.body.emailUser).then(function(result) {  
                if(result){
                    
                    var link = utils.OtherUtils.GenerateCode(256);
                   
                    var attributes = {};
                    attributes.codeResetPasswordUser = link;
                    var request = {
                        where: {
                            emailUser: result.emailUser
                        }
                    };
                    var User = models.User;
                    User.update(attributes, request).then(function (results) {
                        var SendMailUtils = utils.SendMailUtils;
                        var myMail = new SendMailUtils();
                        myMail.sendMail(req.body.emailUser,"Réinitialisation de mot de passe", "Pour réinitialiser votre mot de passe, cliquez ici : " +urlApi+"/login/resetPassword/" +link);
                        res.json({
                            "code":0
                        });
                    }).catch(function (err) {
                        console.log(err)
                        res.json({
                            "code": 2,
                            "message": "Sequelize error",
                            "error": err
                        });
                    });
                }else{
                    res.json({
                        "code" : 5,
                        "message" : "email already used"
                    });   
                }
            }).catch(function (err) {
               console.log(err)
                res.json({
                    "code": 2,
                    "message": "Sequelize error",
                    "error": err
                });
            });
        }else{
            res.json({
                "code": 1,
                "message": "Missing required parameters"
            });
        }
    });

    app.get("/user/findForResetPassword", function(req, res, next) {
        if (req.body.codeResetPasswordUser){
            var User = models.User;
            var request = {
                where: {
                    codeResetPasswordUser : req.body.codeResetPasswordUser
                }
            };
            User.find(request).then(function(result) {
                if (result){          
                    res.json({
                        "code" : 0,  
                    });
                } else {
                    res.json({
                        "code" : 3,
                        "message" : "No password reset"
                    });
                }
            });
        } else {
            res.json({
                "code" : 1,
                "message" : "Missing required parameters"
            });
        }
    });

};
