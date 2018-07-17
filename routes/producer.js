module.exports = function(app, models, TokenUtils, utils) {
    var fs = require("fs");
    var CryptoUtils = utils.CryptoUtils;
    var crpt = new CryptoUtils();
    var jwt = require('jsonwebtoken');

    //CREATE Producer
    app.post("/producer", function(req, res, next) {
        var nameIbanFile =""
        const uuidv4 = require('uuid/v4');
        
        if (req.body.loginUser && req.body.lastNameProducer && req.body.firstNameProducer && req.body.emailProducer && req.body.phoneProducer 
            && req.body.sexProducer && req.body.addressProducer && req.body.cityProducer && req.body.cpProducer 
            && req.body.locationProducer && req.body.token && req.body.paypalProducer && req.body.ibanProducer) {
                
            var Producer = models.Producer;
            var User = models.User;
            var idUser = null;
            var CryptoUtils = utils.CryptoUtils;
            var crpt = new CryptoUtils();
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) { 
                idUser = result.idUser;
                  
                if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result": null,
                    });
                    
                } else {
                   
                    var avatar = "default";
                    var extension;

                    if(req.body.ibanProducer.name!=""){
                       
                        nameIbanFile = uuidv4()+".pdf";
                    }

                    if(req.body.avatarProducer.name!=""){
                        extension = req.body.avatarProducer.name.split('.');
                        avatar = "avatar."+extension[extension.length-1];
                    }
                    var LatLong = req.body.locationProducer.split(',');
                    lat = LatLong[0];
                    long = LatLong[1];

                    Producer.create({
                        "idUserProducer" : idUser,
                        "lastNameProducer" : crpt.encryptAES(req.body.lastNameProducer),
                        "firstNameProducer" : crpt.encryptAES(req.body.firstNameProducer),
                        "emailProducer" : crpt.encryptAES(req.body.emailProducer),
                        "phoneProducer" : crpt.encryptAES(req.body.phoneProducer),
                        "birthProducer" : null,
                        "sexProducer" : crpt.encryptAES(req.body.sexProducer),
                        "addressProducer" : crpt.encryptAES(req.body.addressProducer),
                        "cityProducer" : crpt.encryptAES(req.body.cityProducer),
                        "cpProducer" : req.body.cpProducer,
                        "locationProducer" : crpt.encryptAES(req.body.locationProducer),
                        "descriptionProducer" : req.body.descriptionProducer,
                        "avatarProducer" : avatar,
                        "paypalProducer" : crpt.encryptAES(req.body.paypalProducer),
                        "latProducer" : lat,
                        "longProducer" : long,
                        "ibanProducer": nameIbanFile,
                    }).then(function(result){
                        var request = {
                            "where": {
                                loginUser: req.body.loginUser
                            }
                        };
                        var attributes = {};
                        attributes.typeUser = "1"

                        User.update(attributes, request).then(function (results) {                      
                        }).catch(function (err) {
                           
                        });
                        var filePath=null;
                        var filePath2=null;
                        if(req.body.ibanProducer.name!=""){
                            filePath2 = "ressources/ibanProducer/";
                            if (!fs.existsSync(filePath2)) {
                                fs.mkdirSync(filePath2)
                            }
                            var oldPathIban = req.body.ibanProducer.path;
                            var newPathIban = filePath2 + nameIbanFile;

                            fs.readFile(oldPathIban, function (err, data) {
                                console.log('File read!');
                    
                                // Write the file
                                fs.writeFile(newPathIban, data, function (err) {
                                    var ext = newPathIban.split('.');
                                    var nameCrypt ="";
                                    for (var i =0; i<ext.length-1; i++){
                                        nameCrypt += ext[i];
                                    }
                                    crpt.encrypteFileAES(nameCrypt)
                                        
                                    
                                });
                    
                                // Delete the file
                                fs.unlink(oldPathIban, function (err) {
                                    console.log('File deleted!');
                                });
                            });

                        }

                        if(req.body.avatarProducer.name!=""){
                            filePath = "ressources/producerAvatar/"+result.idProducer+"/";
                            if (!fs.existsSync(filePath)) {
                                fs.mkdirSync(filePath)
                            }
                            
                           
                            var oldpath = req.body.avatarProducer.path;
                            var newpath = filePath+ "avatar."+extension[extension.length-1];
    
                            fs.readFile(oldpath, function (err, data) {
                                console.log('File read!');
                    
                                // Write the file
                                fs.writeFile(newpath, data, function (err) {
                                    console.log('File written!');
                                    utils.OtherUtils.ResizeImg(filePath, "avatar", extension[extension.length - 1], 512, "_medium");
                                    utils.OtherUtils.ResizeImg(filePath, "avatar", extension[extension.length - 1], 384, "_ms");
                                    utils.OtherUtils.ResizeImg(filePath, "avatar", extension[extension.length - 1], 256,"_small");384
                                    utils.OtherUtils.ResizeImg(filePath, "avatar", extension[extension.length - 1], 128,"_xs");
                                    utils.OtherUtils.ResizeImg(filePath, "avatar", extension[extension.length - 1], 64,"_xxs");
                                });
                    
                                // Delete the file
                                fs.unlink(oldpath, function (err) {
                                    console.log('File deleted!');
                                });
                            });
                        }

                        var payload = {
                            admin: 1,
                            id: idUser
                        };
                        var token = jwt.sign(payload, "kukjhifksd489745dsf87d79+62dsfAD_-=", {
                            expiresIn : 60*60*24
                        });

                        
                        res.json({
                            "code" : 0,
                            "message" : "producer",
                            "result": {
                                "id" : result.idProducer,
                                "token" : token
                            },
                            
                        });
                    }).catch(function(err){    
                        console.log(err);         
                        res.json({
                            "code" : 2,
                            "message" : "Sequelize error",
                            "result": null
                            
                        });
                    });
                }
            }).catch(function (err) {
                console.log(err)
                res.json({
                    "code": 2,
                    "message": "Sequelize error",
                    "result": null
                });
            })  ;
            
        } else {
            res.json({
                "code" : 1,
                "message" : "Missing required parameters",
                "result": null
            });
        }
    });
    app.get("/producer/dept", function(req, res, next) {
      
        if (req.body.cp && req.body.token){
            var query = 'SELECT prd.* from producer prd where prd.cpProducer LIKE "'+req.body.cp+'%" ;';
            var jsonResult = {};
            var object= [];
            var sequelize = models.sequelize;
            var utf8 = require('utf8');
            sequelize.query(query,{ type: sequelize.QueryTypes.SELECT  })
            .then(function(result){
                if(result){
                    jsonResult.code =0;
                    for(i=0; i<result.length; i++){
                        var singleObj = {};
                        singleObj.lastNameProducer = utf8.decode(crpt.decryptAES(result[i].lastNameProducer));
                        singleObj.firstNameProducer = utf8.decode(crpt.decryptAES(result[i].firstNameProducer));
                        singleObj.idUserProducer = result[i].idUserProducer;
                        singleObj.cityProducer = utf8.decode(crpt.decryptAES(result[i].cityProducer));
                        object[i] = singleObj;
                    }
                    jsonResult.object = object;
                    res.json({
                        "code" : 0,
                        "message" : "",
                        "result": jsonResult.object
                    });
                }else{
                    res.json({
                        "code" : 3,
                        "message" : "User not found"
                    });
                }

            }).catch(function(err){
                console.log(err);
                res.json({
                    "code" : 2,
                    "message" : "Sequelize error",
                    "error" : err
                });
            });

        }else{
            res.json({
                "code" : 1,
                "message" : "Missing required parameters"
            });
        }
    });

    app.get("/getPublicInformations", function(req, res, next) {
        if(req.query.idProducer){
            req.body.idProducer = req.query.idProducer;
        }
        if (req.body.idProducer){
            
            var sequelize = models.sequelize;
          
            
            var request = {
                attributes: ["idUserProducer", "lastNameProducer", "firstNameProducer", "descriptionProducer", "avatarProducer"],
                where: {
                    idProducer : req.body.idProducer
                }
            };
            var jsonResult = {};
            var CryptoUtils = utils.CryptoUtils;
            var crpt = new CryptoUtils();
            var utf8 = require('utf8');
            sequelize.query("SELECT idUserProducer, lastNameProducer, firstNameProducer, descriptionProducer, avatarProducer, loginUser, addressProducer, cityProducer, locationProducer  FROM user, producer WHERE user.idUser = producer.idUserProducer AND idProducer = :idProducer",{ replacements: { idProducer:  req.body.idProducer }, type: sequelize.QueryTypes.SELECT  })
            .then(function(result){
                
                if(result[0]){
                    jsonResult.code =0;
                    jsonResult.loginUser = result[0].loginUser;
                    jsonResult.lastNameProducer = utf8.decode(crpt.decryptAES(result[0].lastNameProducer));
                    jsonResult.firstNameProducer = utf8.decode(crpt.decryptAES(result[0].firstNameProducer));
                    jsonResult.descriptionProducer = result[0].descriptionProducer;
                    jsonResult.avatarProducer = result[0].avatarProducer;
                    jsonResult.addressProducer = utf8.decode(crpt.decryptAES(result[0].addressProducer));
                    jsonResult.cityProducer = utf8.decode(crpt.decryptAES(result[0].cityProducer));
                    jsonResult.locationProducer = utf8.decode(crpt.decryptAES(result[0].locationProducer));

                    var request2 =  {
                        where: {
                            idProducer : req.body.idProducer,
                            //include: [{model:db.User}]
                        }
                    }
                   
                                
                    sequelize.query("SELECT  comment, starComment, dateComment, loginUser FROM commentProducer, user WHERE user.idUser = commentProducer.idUser AND idProducer = :idProducer Order BY dateComment",{ replacements: { idProducer:  req.body.idProducer }, type: sequelize.QueryTypes.SELECT  })
                    .then(function(result){
                        jsonResult.comment = result;
                        res.json({
                            "code":0,
                            "message": null,
                            "result": jsonResult
                        });
                    }).catch(function(err){
                        //console.log(err);
                        res.json({
                            "code" : 2,
                            "message" : "Sequelize error",
                            "result": null
                        });
                    });
                    
                }else{
                    res.json({
                        "code" : 3,
                        "message" : "User not found",
                        "result": null
                    });
                }

            }).catch(function(err){
                //console.log(err);
                res.json({
                    "code" : 2,
                    "message" : "Sequelize error",
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
    });

    app.post("/producer/getProducer", function(req, res, next) {
        if(req.body.loginUser && req.body.token ){
            var idUser;
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) { 
                idUser = result.idUser;
                if (TokenUtils.verifProducerToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result": null,
                    });
                    
                } else {
                    var request = {
                        where: {
                            idUserProducer : idUser
                        }
                    };

                    var Producer = models.Producer;

                    Producer.find(request).then(function(result){
                        if(result){
                            var CryptoUtils = utils.CryptoUtils;
                            var crpt = new CryptoUtils();
                            var utf8 = require('utf8');
                            res.json({
                                "code" : 0,
                                "message" : "Sequelize error",
                                "result": {
                                    "idProducer" : result.idProducer,
                                    "lastNameProducer" :  utf8.decode(crpt.decryptAES(result.lastNameProducer)),
                                    "firstNameProducer" :  utf8.decode(crpt.decryptAES(result.firstNameProducer)),
                                    "emailProducer" :  utf8.decode(crpt.decryptAES(result.emailProducer)),
                                    "phoneProducer" :  utf8.decode(crpt.decryptAES(result.phoneProducer)),
                                    "birthProducer" : null,
                                    "sexProducer" :  utf8.decode(crpt.decryptAES(result.sexProducer)),
                                    "addressProducer" :  utf8.decode(crpt.decryptAES(result.addressProducer)),
                                    "cityProducer" :  utf8.decode(crpt.decryptAES(result.cityProducer)),
                                    "cpProducer" : result.cpProducer,
                                    "locationProducer" :  utf8.decode(crpt.decryptAES(result.locationProducer)),
                                    "descriptionProducer" : result.descriptionProducer,
                                    "avatarProducer" : result.avatarProducer,
                                    "paypalProducer" :  utf8.decode(crpt.decryptAES(result.paypalProducer))
                                } 
                            });
                        }else{
                           
                            res.json({
                                "code" : 0,
                                "message" : "Producer not found",
                                "result": null
                            });
                        }
                    }).catch(function(err){
                        res.json({
                            "code" : 2,
                            "message" : "Sequelize error",
                            "result": null
                        });
                    })

                }
            }).catch(function(err){
                res.json({
                    "code" : 2,
                    "message" : "Sequelize error",
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

    app.post("/producer/update", function(req, res, next) {
        
        if(req.body.loginUser && req.body.token && req.body.photoChange && req.body.paypalChange && req.body.lastNameProducer && req.body.firstNameProducer && req.body.emailProducer && req.body.phoneProducer && req.body.sexProducer && req.body.addressProducer && req.body.cityProducer && req.body.cpProducer && req.body.locationProducer){
            var idUser;
            var idProducer;
            var Producer = models.Producer;
            var oldIbanProducer="";
            const uuidv4 = require('uuid/v4');
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) { 
                idUser = result.idUser;
                if (TokenUtils.verifProducerToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result": null,
                    });
                    
                } else {
                    Producer.find({where: { idUserProducer : idUser}}).then(function(result){
                        idProducer = result.idProducer
                        var extOldIban = result.ibanProducer.split('.');
                       
                        for (var i =0; i<extOldIban.length-1; i++){
                            oldIbanProducer += extOldIban[i];
                        }
                        if(req.body.ibanProducer.name!=""){
                           
                            fs.unlink("ressources/ibanProducer/"+oldIbanProducer+".dat", function (err) {
                                console.log('File deleted!');
                            });
                        }
                       
                        
                    })
                    var request = {
                        where: {
                            idUserProducer : idUser
                        }
                    };

                    var CryptoUtils = utils.CryptoUtils;
                    var crpt = new CryptoUtils();
                    var attributes = {};
                    if(req.body.photoChange == "true"){
                        var avatar = "default";
                        var extension;
                        if(req.body.avatarProducer.name !=""){
                            extension = req.body.avatarProducer.name.split('.');
                            avatar = "avatar."+extension[extension.length-1];
                        }
                        attributes.avatarProducer= avatar;
                    }
                    
                    if(req.body.paypalChange == "true"){
                        attributes.paypalProducer= crpt.encryptAES(req.body.paypalProducer);
                    }

                    var LatLong = req.body.locationProducer.split(',');
                    lat = LatLong[0];
                    long = LatLong[1];

                    
                    if(req.body.ibanProducer.name!=""){
                       
                        var nameIbanFile=  uuidv4()+".pdf";;
                        attributes.ibanProducer =  nameIbanFile;;
                       
                    }
                    
                    attributes.lastNameProducer = crpt.encryptAES(req.body.lastNameProducer);
                    attributes.firstNameProducer = crpt.encryptAES(req.body.firstNameProducer);
                    attributes.emailProducer = crpt.encryptAES(req.body.emailProducer);
                    attributes.phoneProducer= crpt.encryptAES(req.body.phoneProducer);
                    attributes.birthProducer= null;
                    attributes.sexProducer= crpt.encryptAES(req.body.sexProducer);
                    attributes.addressProducer= crpt.encryptAES(req.body.addressProducer);
                    attributes.cityProducer= crpt.encryptAES(req.body.cityProducer);
                    attributes.cpProducer= req.body.cpProducer;
                    attributes.locationProducer= crpt.encryptAES(req.body.locationProducer);
                    attributes.descriptionProducer= req.body.descriptionProducer;

                    attributes.latProducer= lat;
                    attributes.longProducer= long;

                    Producer.update(attributes, request).then(function(results){
                        
                        
                        if(req.body.ibanProducer.name!=""){
                            filePath2 = "ressources/ibanProducer/";
                            if (!fs.existsSync(filePath2)) {
                                fs.mkdirSync(filePath2)
                            }
                            var oldPathIban = req.body.ibanProducer.path;
                            var newPathIban = filePath2 + nameIbanFile;

                            fs.readFile(oldPathIban, function (err, data) {
                                console.log('File read!');
                    
                                // Write the file
                                fs.writeFile(newPathIban, data, function (err) {
                                    var ext = newPathIban.split('.');
                                    var nameCrypt ="";
                                    for (var i =0; i<ext.length-1; i++){
                                        nameCrypt += ext[i];
                                    }
                                    crpt.encrypteFileAES(nameCrypt)
                                        
                                    
                                });
                    
                                // Delete the file
                                fs.unlink(oldPathIban, function (err) {
                                    console.log('File deleted!');
                                });
                            });

                        }

                        var filePath=null;


                        if(req.body.avatarProducer.name!=""){
                            filePath = "ressources/producerAvatar/"+idProducer+"/";
                            if (!fs.existsSync(filePath)) {
                                fs.mkdirSync(filePath)
                            }
                            var oldpath = req.body.avatarProducer.path;
                            var newpath = filePath+ "avatar."+extension[extension.length-1];
                            
                            fs.readFile(oldpath, function (err, data) {
                                console.log('File read!');
                    
                                // Write the file
                                fs.writeFile(newpath, data, function (err) {
                                    console.log('File written!' + filePath);
                                    utils.OtherUtils.ResizeImg(filePath, "avatar", extension[extension.length - 1], 512, "_medium");
                                    utils.OtherUtils.ResizeImg(filePath, "avatar", extension[extension.length - 1], 384, "_ms");
                                    utils.OtherUtils.ResizeImg(filePath, "avatar", extension[extension.length - 1], 256,"_small");384
                                    utils.OtherUtils.ResizeImg(filePath, "avatar", extension[extension.length - 1], 128,"_xs");
                                    utils.OtherUtils.ResizeImg(filePath, "avatar", extension[extension.length - 1], 64,"_xxs");
                                });
                    
                                // Delete the file
                                fs.unlink(oldpath, function (err) {
                                    console.log('File deleted!');
                                });
                            });
                        }
                        res.json({
                            "code": 0,
                            "message": "ok",
                            "result": {
                                "id": results[0]
                            }   
                        });
                    }).catch(function (err) {
                        //console.log(err)
                        res.json({
                            "code": 2,
                            "message": "Sequelize error",
                            "result": null
                        });
                    });  
                }

            }).catch(function(err){
                //console.log(err)
                res.json({
                    "code" : 2,
                    "message" : "Sequelize error",
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
    
    });

    app.post("/commentProducer", function(req, res, next) {
        console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
       console.log(req.body)
        if(req.body.loginUser && req.body.token && (req.body.stars || req.body.stars) && req.body.idProducer){
            var idUser;
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) { 
                idUser = result.idUser;
                if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result": null,
                    });    
                } else {
                    var comment="";
                    if(req.body.comment){
                        comment = req.body.comment;
                    }
                    var CommentProducer = models.CommentProducer;
                    CommentProducer.create({
                        "idProducer": req.body.idProducer,
                        "idUser": idUser ,
                        "comment": comment,
                        "starComment": req.body.stars,
                        "dateComment": new Date()
                    }).then(function(result){
                        if(result){
                            res.json({
                                "code": 0,
                                "message": "ok",
                                "result": null
                            });
                        }else{
                            res.json({
                                "code" : 2,
                                "message" : "Sequelize error",
                                "result": null
                            });
                        }
                    }).catch(function(err){
                        res.json({
                            "code" : 2,
                            "message" : "Sequelize error",
                            "result": null
                        });
                    })
                }
            });
        }else{
            res.json({
                "code" : 1,
                "message" : "Missing required parameters",
                "result": null
            });
        }
    })




}