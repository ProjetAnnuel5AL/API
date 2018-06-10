module.exports = function(app, models, TokenUtils, utils) {
    var fs = require("fs");


    //CREATE Producer
    app.post("/producer", function(req, res, next) {
        if (req.body.loginUser && req.body.lastNameProducer && req.body.firstNameProducer && req.body.emailProducer && req.body.phoneProducer && req.body.birthProducer && req.body.sexProducer && req.body.addressProducer && req.body.cityProducer && req.body.cpProducer && req.body.token && req.body.paypalProducer) {
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
                        "message" : "Failed to authenticate token"
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
                        "cpProducer" : crpt.encryptAES(req.body.cpProducer),
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
                            "id" : result.idProducer
                        });
                    }).catch(function(err){    
                        console.log(err);         
                        res.json({
                            "code" : 2,
                            "message" : "Sequelize error"
                            
                        });
                    });
                }
            }).catch(function (err) {
                console.log(err)
                res.json({
                    "code": 2,
                    "message": "Sequelize error",
                    "error": err
                });
            })  ;
            
        } else {
            res.json({
                "code" : 1,
                "message" : "Missing required parameters"
            });
        }
    });


    app.get("/getPublicInformations", function(req, res, next) {
        if (req.body.idProducer){
            
            var Producer = models.Producer;
            var CommentProducer = models.CommentProducer;
            var User = models.User;
            
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
            Producer.find(request).then(function(result){
                if(result){
                    jsonResult.code =0;
                    jsonResult.lastNameProducer = utf8.decode(crpt.decryptAES(result.lastNameProducer));
                    jsonResult.firstNameProducer = utf8.decode(crpt.decryptAES(result.firstNameProducer));
                    jsonResult.descriptionProducer = result.descriptionProducer;
                    jsonResult.avatarProducer = result.avatarProducer;

                    var request2 =  {
                        where: {
                            idProducer : req.body.idProducer,
                            //include: [{model:db.User}]
                        }
                    }
                    var sequelize = models.sequelize;
                                
                    sequelize.query("SELECT  comment, starComment, dateComment, loginUser FROM commentProducer, user WHERE user.idUser = commentProducer.idUser AND idProducer = :idProducer Order BY dateComment",{ replacements: { idProducer:  req.body.idProducer }, type: sequelize.QueryTypes.SELECT  })
                    .then(function(result){
                        jsonResult.comment = result;
                        res.json(jsonResult);
                    }).catch(function(err){
                        //console.log(err);
                        res.json({
                            "code" : 2,
                            "message" : "Sequelize error",
                            "error" : err
                        });
                    });
                    
                }else{
                    res.json({
                        "code" : 3,
                        "message" : "User not found"
                    });
                }

            }).catch(function(err){
                //console.log(err);
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

}