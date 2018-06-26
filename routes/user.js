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
    var utf8 = require('utf8');

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
                        "message" : "login already used",
                        "result" : null
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
                                    "message" : null,
                                    "result" : {
                                        "loginUser" : result.loginUser,
                                        "emailUser" : result.emailUser
                                    }
                                    
                                });
                            }).catch(function(err){
                                //console.log(err)
                                res.json({
                                    "code" : 2,
                                    "message" : "Sequelize error",
                                    "result":null
                                });
                            });
                       }else{
                            res.json({
                                "code" : 5,
                                "message" : "email already used",
                                "result":null
                            });
                       }
                    })    
                }

            }).catch(function(err){
                console.log(err)
                res.json({
                    "code" : 2,
                    "message" : "Sequelize error",
                    "result":null
                });
            });
        } else {
            res.json({
                "code" : 1,
                "message" : "Missing required parameters",
                "result":null
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
                            "message":"Validated user account",
                            "result":null
                        });
                    }).catch(function (err) {
                        res.json({
                            "code": 2,
                            "message": "Sequelize error",
                            "result":null
                        });
                    });

                } else {
                    res.json({
                        "code" : 3,
                        "message" : "User not found",
                        "result":null
                    });
                }
            });
        } else {
            res.json({
                "code" : 1,
                "message" : "Missing required parameters",
                "result":null
            });
        }
    });

	//On récupère les infos persos
	app.get("/user/findEmail", function (req, res, next) {
        if(req.body.token && req.body.loginUser){ 
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {       
                if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result":null
                    });
                } else {   
                    var CryptoUtils = utils.CryptoUtils;
                    var crpt = new CryptoUtils();
                    

                    var User = models.User;
                    var request = {
                        attributes: ["emailUser"],
                        where: {
                            loginUser: req.body.loginUser
                        }
                    };
                    User.find(request).then(function (result) {
                        if (result) {
                            res.json({
                                "code": 0,
                                "message":null,
                                "result":{
                                    "emailUser": utf8.decode(crpt.decryptAES(result.emailUser))
                                }
                            });
                        } else {
                            res.json({
                                "code": 3,
                                "message": "User not found",
                                "result":null
                            });
                        }
                    });
                }
            }).catch(function (err) {
                //console.log(err)
                res.json({
                    "code": 2,
                    "message": "Sequelize error",
                    "result": null
                });
            });    
        } else {
            res.json({
                "code": 1,
                "message": "Missing required parameters",
                "result": null
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
                        "message" : null,
                        "result":{
                            "loginUser" : result.loginUser,
                        }
                        
                    });
                } else {
                    res.json({
                        "code" : 3,
                        "message" : "User not found with this login",
                        "result": null
                    });
                }
            });
        } else {
            res.json({
                "code" : 1,
                "message" : "Missing required parameters",
                "result": null
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
                            "message" : "User account not validated",
                            "result": null
                        });
                    }else{
                        res.json({
                            "code" : 0,
                            "message" : "",
                            "result": null   
                        });
                    }
                    
                } else {
                    res.json({
                        "code" : 3,
                        "message" : "User not found with this login",
                        "result": null   
                    });
                }
            });
        } else {
            res.json({
                "code" : 1,
                "message" : "Missing required parameters",
                "result": null   
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
                            "message": null,   
                            "result": {
                                "loginUser" : result.loginUser,
                                "emailUser" : result.emailUser,
                                "typeUser" : result.typeUser,
                                "token" : token
                            }  
                        });
                    }else{
                        res.json({
                            "code" : 3,
                            "message" : "Wrong pwd",
                            "result" : null,
                        });
                    }
                }else{
                    res.json({
                        "code" : 3,
                        "message" : "User not found",
                        "result" : null,
                    });
                }
            }).catch(function(err){
                res.json({
                    "code" : 2,
                    "message" : "Sequelize error",
                    "result" : null,
                });
            });
        } else {
            res.json({
                "code" : 1,
                "message" : "Missing required parameters",
                "result" : null,
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
                                "message":"user deleted",
                                "result" : null,
                            });
                        }else{
                            res.json({
                                "code" : 2,
                                "message" : "Sequelize error",
                                "result" : null,
                            });
                        }
                    }).catch(function(err){
                        le.log(err);
                    });
                }else{
                    res.json({
                        "code" : 3,
                        "message" : "User not found",
                        "result" : null,
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
                                    "message": null,
                                    "result" : {
                                        "lastNameUser" : null,
                                        "firstNameUser" : null,
                                        "sexUser" : null,
                                        "addressUser" : null,
                                        "cityUser" : null,
                                        "cpUser" : null
                                    }
                                })
                            }else{
                                res.json({
                                    "code" : 0,
                                    "message": null,
                                    "result" : {
                                        "lastNameUser" : utf8.decode(crpt.decryptAES(result.lastNameUser)),
                                        "firstNameUser" : utf8.decode(crpt.decryptAES(result.firstNameUser)),
                                        "sexUser" : crpt.decryptAES(result.sexUser),
                                        "addressUser" : utf8.decode(crpt.decryptAES(result.addressUser)),
                                        "cityUser" : utf8.decode(crpt.decryptAES(result.cityUser)),
                                        "cpUser" : utf8.decode(crpt.decryptAES(result.cpUser))
                                    }
                                    
                                })
                            }
                        }else{
                            res.json({
                                "code": 3,
                                "message": "User not found",
                                "result":null
                            });
                        }
                    }).catch(function (err) {
                        //console.log(err)
                        res.json({
                            "code": 2,
                            "message": "Sequelize error",
                            "result": null
                        });
                    });  
                }  
            }).catch(function (err) {
                //console.log(err)
                res.json({
                    "code": 2,
                    "message": "Sequelize error",
                    "result": null
                });
            });         
        }else{
            res.json({
                "code" : 1,
                "message" : "Missing required parameters",
                "result": null
            });
        }
    })


    app.post("/user/update", function (req, res, next) {


        if(!req.body.token && !req.body.code){
            res.json({
                "code" : 6,
                "message" : "Missing token",
                "result": null
            });
        }else if(req.body.token){

            // verifies secret and checks exp
            
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {       
                if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result": null
                    });
                    
                } else {             
                    if(req.body.loginUser){
                        var CryptoUtils = utils.CryptoUtils;
                        var crpt = new CryptoUtils();

                        var request = {
                            "where": {
                                loginUser: req.body.loginUser
                            }
                        };
                
                        var attributes = {};
                        if (req.body.emailUser) {
                            attributes.emailUser = crpt.encryptAES(req.body.emailUser);
                        }

                        if (req.body.passwordUser) {

                            var salt = utils.OtherUtils.GenerateCode(50);
                            var pwdSalty = req.body.passwordUser + salt;

                            attributes.passwordUser = bcrypt.hashSync(pwdSalty, null, null);
                            attributes.saltUser = salt;
                        }
                        
                        if (req.body.firstNameUser && req.body.lastNameUser && req.body.sexUser && req.body.addressUser && req.body.cityUser && req.body.cpUser) {
                            attributes.firstNameUser = crpt.encryptAES(req.body.firstNameUser);
                            attributes.lastNameUser = crpt.encryptAES(req.body.lastNameUser);
                            attributes.sexUser = crpt.encryptAES(req.body.sexUser);
                            attributes.addressUser = crpt.encryptAES(req.body.addressUser);
                            attributes.cityUser = crpt.encryptAES(req.body.cityUser);
                            attributes.cpUser = crpt.encryptAES(req.body.cpUser);
                        }
            
                        var User = models.User;
                        User.update(attributes, request).then(function (results) {
                            res.json({
                                "code":0,
                                "message":"User updated",
                                "result": null
                            });
                        }).catch(function (err) {
                            res.json({
                                "code": 2,
                                "message": "Sequelize error",
                                "result": null
                            });
                        });
                    }else{
                        res.json({
                            "code" : 1,
                            "message" : "Missing required parameters",
                            "result": null
                        });
                    }
                }
            }).catch(function (err) {
                res.json({
                    "code": 2,
                    "message": "Sequelize error",
                    "result": null
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
                    "message":"User updated",
                    "result": null
                });
            }).catch(function (err) {
               
                res.json({
                    "code": 2,
                    "message": "Sequelize error",
                    "result": null
                });
            });
        }
    
    });

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
                            "message" : "account is already validate",
                            "result": null   
                        })
                    }else{
                        code = result.validationCodeUser


                        var SendMailUtils = utils.SendMailUtils;
                        var myMail = new SendMailUtils();
                        //on change le mail si différent
                        var CryptoUtils = utils.CryptoUtils;
                        var crpt = new CryptoUtils();

                        if(utf8.decode(crpt.decryptAES(result.emailUser)) != req.body.emailUser){
                            //on vérifie que l'email n'est pas déjà utilisé
                            var FinderUtils = utils.FinderUtils;
                            FinderUtils.CheckEmailUser(req.body.emailUser).then(function(result) {  
                                if(result){
                                    res.json({
                                        "code": 4,
                                        "message": "email already used",
                                        "result": null
                                    });
                                }else{
                                    var attributes = {};
                                    attributes.emailUser = crpt.encryptAES(req.body.emailUser);
                                    var User = models.User;

                                    User.update(attributes, request).then(function(results){
                                        myMail.sendMail(req.body.emailUser,"Validation Inscription", "Votre inscription à bien été prise en compte. Afin de valider votre inscription merci de suivre le lien suivant : " +urlApi+"/registrationValidation/" +result.validationCodeUser );
                                        res.json({
                                            "code": 0,
                                            "message": "ok",
                                            "result": null   
                                        });
                                    }).catch(function (err) {
                                        res.json({
                                            "code": 2,
                                            "message": "Sequelize error",
                                            "result": null
                                        });
                                    });  
                                }
                            }).catch(function (err) {
                                res.json({
                                    "code": 2,
                                    "message": "Sequelize error",
                                    "result": null
                                });
                            });
                        }else{
                            myMail.sendMail(req.body.emailUser,"Validation Inscription", "Votre inscription à bien été prise en compte. Afin de valider votre inscription merci de suivre le lien suivant : " +urlApi+"/registrationValidation/" +result.validationCodeUser );     
                            res.json({
                                "code": 0,
                                "message": "ok",
                                "result": null      
                            });
                        }
                    }
                } else {
                    res.json({
                        "code": 3,
                        "message": "User not found",
                        "result": null
                    });
                }
            }).catch(function (err) {
                
                res.json({
                    "code": 2,
                    "message": "Sequelize error",
                    "result": null
                });
            });
        } else {
            res.json({
                "code": 1,
                "message": "Missing required parameters",
                "result": null
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
                            "code":0,
                            "message":null,
                            "result": null,
                        });
                    }).catch(function (err) {
                        console.log(err)
                        res.json({
                            "code": 2,
                            "message": "Sequelize error",
                            "result": null
                        });
                    });
                }else{
                    res.json({
                        "code" : 5,
                        "message" : "email already used",
                        "result": null
                    });   
                }
            }).catch(function (err) {
               console.log(err)
                res.json({
                    "code": 2,
                    "message": "Sequelize error",
                    "result": null
                });
            });
        }else{
            res.json({
                "code": 1,
                "message": "Missing required parameters",
                "result": null
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
                        "message":null,
                        "result": null,  
                    });
                } else {
                    res.json({
                        "code" : 3,
                        "message" : "No password reset",
                        "result": null
                    });
                }
            });
        } else {
            res.json({
                "code" : 1,
                "message" : "Missing required parameters",
                "result": null
            });
        }
    });

};
