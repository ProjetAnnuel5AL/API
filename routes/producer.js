module.exports = function(app, models, TokenUtils, utils) {
    var fs = require("fs");
    var CryptoUtils = utils.CryptoUtils;
    var crpt = new CryptoUtils();

    //CREATE Producer
    app.post("/producer", function(req, res, next) {
        if (req.body.loginUser && req.body.lastNameProducer && req.body.firstNameProducer && req.body.emailProducer && req.body.phoneProducer && req.body.birthProducer && req.body.sexProducer && req.body.addressProducer && req.body.cityProducer && req.body.locationProducer && req.body.token && req.body.paypalProducer) {
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
                    if(req.body.avatarProducer.name!=""){
                        extension = req.body.avatarProducer.name.split('.');
                        avatar = "avatar."+extension[extension.length-1];
                    }
                    Producer.create({
                        "idUserProducer" : idUser,
                        "lastNameProducer" : crpt.encryptAES(req.body.lastNameProducer),
                        "firstNameProducer" : crpt.encryptAES(req.body.firstNameProducer),
                        "emailProducer" : crpt.encryptAES(req.body.emailProducer),
                        "phoneProducer" : crpt.encryptAES(req.body.phoneProducer),
                        "birthProducer" : req.body.birthProducer,
                        "sexProducer" : crpt.encryptAES(req.body.sexProducer),
                        "addressProducer" : crpt.encryptAES(req.body.addressProducer),
                        "cityProducer" : crpt.encryptAES(req.body.cityProducer),
                        "cpProducer" : req.body.cpProducer,
                        "locationProducer" : crpt.encryptAES(req.body.locationProducer),
                        "descriptionProducer" : req.body.descriptionProducer,
                        "avatarProducer" : avatar,
                        "paypalProducer" : crpt.encryptAES(req.body.paypalProducer)
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
                                });
                    
                                // Delete the file
                                fs.unlink(oldpath, function (err) {
                                    console.log('File deleted!');
                                });
                            });
                        }

                        res.json({
                            "code" : 0,
                            "message" : "producer",
                            "result": {
                                "id" : result.idProducer
                            },
                            
                        });
                    }).catch(function(err){    
                        //console.log(err);         
                        res.json({
                            "code" : 2,
                            "message" : "Sequelize error",
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
        console.log(req.body);
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
                    res.json(jsonResult);
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

}