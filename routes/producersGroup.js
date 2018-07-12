module.exports = function(app, models, TokenUtils, utils) {
  var fs = require("fs");
  const empty = require('empty-folder');
  var CryptoUtils = utils.CryptoUtils;
  var crpt = new CryptoUtils();
  app.post("/producersGroup", function (req, res, next) {
    if (req.body.description && req.body.location && req.body.city && req.body.adress && req.body.phone &&
      req.body.email && req.body.name && req.body.avatar && req.body.token && req.body.loginUser) {
      var ProducersGroup = models.ProducersGroup;
      var id = null;
      var userId;
      var idUser;
      if (req.body.id) {
        id = req.body.id;
      }
      TokenUtils.findIdUser(req.body.loginUser).then(function (result) {
        idUser = result.idUser;

        if (TokenUtils.verifProducerToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
          res.json({
            "code": 6,
            "message": "Failed to authenticate token"
          });

        } else {
          var avatar = "default";
          var extension;
          if (req.body.avatar.name != "") {
            extension = req.body.avatar.name.split('.');
            avatar = "avatar." + extension[extension.length - 1];
          }
          var LatLong = req.body.location.split(',');
            
          ProducersGroup.create({
            "id": id,
            "founderUserId": idUser,
            "avatar": avatar,
            "name": req.body.name,
            "email": crpt.encryptAES(req.body.email),
            "phone": crpt.encryptAES(req.body.phone),
            "adress": req.body.adress,
            "city": req.body.city,
            "location": req.body.location,
            "latGroup" : LatLong[0],
            "longGroup" : LatLong[1],
            "description": req.body.description

          }).then(function (result) {
            var filePath = null;
            if (req.body.avatar.name != "") {
              filePath = "ressources/groupAvatar/" + result.id + "/";
              if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath)
              }
              var oldpath = req.body.avatar.path;
              var newpath = filePath + "avatar." + extension[extension.length - 1];

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
              "code": 0,
              "message":"",
              "result": result.id
            });
          }).catch(function (err) {
            console.log(err);
            res.json({
              "code": 2,
              "message": "Sequelize error"
            });
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
  app.get("/producersGroup/member/userId/", function(req, res, next) {
    if(req.body.token, req.body.loginUser){
      var idUser;
      TokenUtils.findIdUser(req.body.loginUser).then(function (result) {
      idUser = result.idUser;
      if (TokenUtils.verifProducerToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", idUser) == false) {
        res.json({
          "code": 6,
          "message": "Failed to authenticate token",
          "result": null,
        });
      }
      var query = 'SELECT grp.*, (select count(id) from producersGroupMember where idGroup = grp.id AND deletedAt IS NULL) as countMembers FROM producersGroup grp, producersGroupMember mbr where mbr.idGroup = grp.id AND grp.deletedAt IS NULL AND mbr.idUser = '+idUser+' ;';
      var sequelize = models.sequelize;
        
      
      sequelize.query(query,{ type: sequelize.QueryTypes.SELECT  })
        .then(function(result){
            if(result){         
              res.json({
                "code":0,
                "message":null,
                "result": result
              });
            }else{
              res.json({
                "code" : 3,
                "message" : "Item not found"
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
    });
    }
    else {
      res.json({
        "code": 1,
        "message": "Missing required parameters"
      });
    }
  });
  app.get("/producersGroup/founder/userId/", function(req, res, next) {
    if(req.body.token, req.body.loginUser){
      var idUser;
      TokenUtils.findIdUser(req.body.loginUser).then(function (result) {
      idUser = result.idUser;
      if (TokenUtils.verifProducerToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", idUser) == false) {
        res.json({
          "code": 6,
          "message": "Failed to authenticate token",
          "result": null,
        });
      }
      var query = 'SELECT grp.*, (select count(id) from producersGroupMember where idGroup = grp.id AND deletedAt IS NULL) as countMembers FROM producersGroup grp where grp.deletedAt IS NULL AND grp.founderUserId = '+idUser+' ;';
      var sequelize = models.sequelize;
        
      
      sequelize.query(query,{ type: sequelize.QueryTypes.SELECT  })
        .then(function(result){
            if(result){
              res.json({
                "code":0,
                "message":null,
                "result": result
              });
            }else{
              res.json({
                "code" : 3,
                "message" : "Item not found"
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
    });
    }
    else {
      res.json({
        "code": 1,
        "message": "Missing required parameters"
      });
    }
  });

  app.get("/producersGroup/subscriber/id/", function(req, res, next) {
    if(req.body.token, req.body.loginUser){
      var idUser;
      TokenUtils.findIdUser(req.body.loginUser).then(function (result) {
      idUser = result.idUser;
      if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", idUser) == false) {
        res.json({
          "code": 6,
          "message": "Failed to authenticate token",
          "result": null,
        });
      }else{
      var query = 'SELECT grp.*, (select count(id) from producersGroupMember where idGroup = grp.id AND deletedAt IS NULL) as countMembers FROM producersGroup grp, producersGroupSubscriber gps where grp.id = gps.idGroup AND grp.deletedAt IS NULL AND gps.deletedAt IS NULL AND gps.idUser = '+idUser+' ;';
      var sequelize = models.sequelize;
        
      
      sequelize.query(query,{ type: sequelize.QueryTypes.SELECT  })
        .then(function(result){
            if(result){
              res.json({
                "code":0,
                "message":null,
                "result": result
              });
            }else{
              res.json({
                "code" : 3,
                "message" : "Item not found"
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
      }
    });
    }
    else {
      res.json({
        "code": 1,
        "message": "Missing required parameters"
      });
    }
  });

  app.get("/producersGroup/search", function(req, res, next) {
    if(req.query.lat && req.query.long && req.body.token){
      var userId = TokenUtils.getIdAndType(req.body.token).id;
      if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
        res.json({
          "code": 6,
          "message": "Failed to authenticate token"
        });
      }
      var query = "SELECT grp.*, (select count(id) from producersGroupMember where idGroup = grp.id AND deletedAt IS NULL) "+
        "as countMembers, ( 6371 * acos( cos( radians("+req.query.lat+") ) * cos( radians( grp.latGroup ) )"+
        "* cos( radians(grp.longGroup) - radians("+req.query.long+")) + sin(radians("+req.query.lat+"))"+ 
        "* sin( radians(grp.latGroup)))) AS distance "+
        "FROM producersGroup grp where grp.deletedAt IS NULL "+
        " HAVING distance < 100 ORDER BY distance";
      var sequelize = models.sequelize;
        
      
      sequelize.query(query,{ type: sequelize.QueryTypes.SELECT  })
        .then(function(result){
            if(result){         
              for(i = 0; i< result.length; i++){
                result[i].distance = result[i].distance.toFixed(0);
              }
              res.json({
                "code":0,
                "message":null,
                "result": result
              });
            }else{
              res.json({
                "code" : 3,
                "message" : "Item not found"
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
    }else {
      res.json({
        "code": 1,
        "message": "Missing required parameters"
      });
    }
  });

  app.get("/producersGroup/idGroup/", function(req, res, next) {
    if(req.query.idGroup && req.query.token){
      var userId = TokenUtils.getIdAndType(req.query.token).id;
      if (TokenUtils.verifSimpleToken(req.query.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
        res.json({
          "code": 6,
          "message": "Failed to authenticate token"
        });
      }else{
        var utf8 = require('utf8');
        var id = req.query.idGroup;
        var coop;
        var query = 'SELECT grp.*, usr.loginUser, prd.lastNameProducer, prd.firstNameProducer, prd.cpProducer, prd.avatarProducer, '
        +'prd.descriptionProducer, (select count(id) from producersGroupMember where idGroup = grp.id AND deletedAt IS NULL) as countMembers'
        +' FROM producersGroup grp, producer prd, user usr where usr.idUser = prd.idUserProducer AND grp.deletedAt IS NULL AND prd.idUserProducer=grp.founderUserId AND grp.id = '+id+' ;';
        var sequelize = models.sequelize;
        sequelize.query(query,{ type: sequelize.QueryTypes.SELECT  })
        .then(function(result){
            if(result){
                coop = result[0];
                if(result.length==1){
                  coop.email = crpt.decryptAES(coop.email);
                  coop.phone = crpt.decryptAES(coop.phone);
                  coop.firstNameProducer = utf8.decode(crpt.decryptAES(coop.firstNameProducer));
                  coop.lastNameProducer = utf8.decode(crpt.decryptAES(coop.lastNameProducer));
                }
                res.json({
                  code: 0,
                  message: null,
                  result : coop
                });
            }else{
                res.json({
                    "code" : 3,
                    "message" : "Member not found"
                });
            }
        }).catch(function(err){    
            console.log(err);
            res.json({
              "code": 2,
              "message": "Sequelize error"

            });
          });
      }
    }else {
      res.json({
        "code": 1,
        "message": "Missing required parameters"
      });
    }
  });

  app.delete("/producersGroup/idGroup", function(req, res, next) {
        if(req.body.idGroup && req.body.token){
        var userId = TokenUtils.getIdAndType(req.body.token).id;
        if (TokenUtils.verifProducerToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
          res.json({
            "code": 6,
            "message": "Failed to authenticate token",
            "result": null,
          });
        }else{
          var idGroup = req.body.idGroup;
          var ProducersGroup = models.ProducersGroup;
          ProducersGroup.destroy({
          where: {
            id: idGroup,
            founderUserId: userId
          } 
          }).then(function(result){
              if(result){
                var filePath = null;
                filePath = "ressources/groupAvatar/" + req.body.idGroup + "/";
                empty(filePath, true, (o) => {
                  if (o.error) console.error(err);
                  //console.log(o.removed);
                  //console.log(o.failed);
                });
                  res.json({
                    "code": 0,
                    "message": "",
                    "result": result
                  });
              }else{
                  res.json({
                      "code" : 3,
                      "message" : "Producers group not found"
                  });
              }
            }).catch(function (err) {
              console.log(err);
              res.json({
                "code": 2,
                "message": "Sequelize error"

              });
            });
        }
        }else {
      res.json({
        "code": 1,
        "message": "Missing required parameters"
      });
    }
    });
};