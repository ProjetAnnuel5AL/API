module.exports = function(app, models, TokenUtils, utils) {
  var CryptoUtils = utils.CryptoUtils;
  var crpt = new CryptoUtils();
  app.post("/producersGroupEventParticipant", function (req, res, next) {
    if(req.body.idEvent  && req.body.token && req.body.typeParticipant && req.body.libelleParticipant){
      var userId = TokenUtils.getIdAndType(req.body.token).id;
      if (TokenUtils.verifProducerToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
        res.json({
          "code": 6,
          "message": "Failed to authenticate token",
          "result": null,
        });
      }else{
        var ProducersGroupEventParticipant = models.ProducersGroupEventParticipant;
        var id = null;
        if (req.body.id) {
            id = req.body.id;
        }
        ProducersGroupEventParticipant.create({
            "idParticipant": id,
            "idUser": userId,
            "idEvent": req.body.idEvent,
            "typeParticipant": req.body.typeParticipant,
            "libelleParticipant": req.body.libelleParticipant
        }).then(function (result) {
            res.json({
            "code": 0,
            "id": result.id
            });
        }).catch(function (err) {
            console.log(err);
            res.json({
            "code": 2,
            "message": "Sequelize error",
            "error": err
            });
        });
      }
    } else {
      res.json({
        "code": 1,
        "message": "Missing required parameters"
      });
    }
  });
  app.get("/producersGroupEventParticipant/id/", function(req, res, next) {
    if(req.query.id && req.query.token){
        var userId = TokenUtils.getIdAndType(req.query.token).id;
        if (TokenUtils.verifSimpleToken(req.query.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
            res.json({
            "code": 6,
            "message": "Failed to authenticate token",
            "result": null,
            });
        }else{
            var ProducersGroupEventParticipant = models.ProducerGroupEventParticipant;
            var request = {
                attributes: ["id", "idUser", "idGroup"],  
                where: {
                id : req.query.id
                }
            };
            ProducersGroupEventParticipant.findAll(request).then(function(result){
                if(result){
                    res.json(result);
                }else{
                    res.json({
                        "code" : 3,
                        "message" : "EventParticipant not found"
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
    }
  });
  app.get("/producersGroupEventParticipant/idUser/", function(req, res, next) {
    if(req.query.idUser && req.query.token){
        var userId = req.query.idUser;
        if (TokenUtils.verifSimpleToken(req.query.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
            res.json({
            "code": 6,
            "message": "Failed to authenticate token",
            "result": null,
            });
        }else{
            var ProducersGroupEventParticipant = models.ProducersGroupEventParticipant;
            var request = {
                attributes: ["id", "idUser", "idGroup"],  
                where: {
                idUser : req.query.idUser
                }
            };
            ProducersGroupEventParticipant.findAll(request).then(function(result){
                if(result){
                    res.json(result);
                }else{
                    res.json({
                        "code" : 3,
                        "message" : "EventParticipant not found"
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
    }
  });
  app.get("/producersGroupEventParticipant/producer/idGroup/", function(req, res, next) {
    if(req.query.idGroup && req.query.token){
        var userId = TokenUtils.getIdAndType(req.query.token).id;
        if (TokenUtils.verifSimpleToken(req.query.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
            res.json({
                "code": 6,
                "message": "Failed to authenticate token",
                "result": null,
            });
        }else{
            var idGroup = req.query.idGroup;
            var query = 'SELECT gep.*, prd.*, usr.loginUser from producersGroupEventParticipant gep, producer prd, user usr where usr.idUser = prd.idUserProducer AND prd.idUserProducer = gep.idUser AND gep.typeParticipant = 1 AND gep.deletedAt IS NULL AND gep.idGroup = '+idGroup+' ;';
            var jsonResult = {};
            var sequelize = models.sequelize;
            var utf8 = require('utf8');
            sequelize.query(query,{ type: sequelize.QueryTypes.SELECT  })
            .then(function(result){
                if(result){
                    jsonResult.code = 0;
                    jsonResult.list = result;
                    for(var producerIndex = 0; producerIndex < jsonResult.list.length; producerIndex++){
                        jsonResult.list[producerIndex].firstNameProducer = utf8.decode(crpt.decryptAES(jsonResult.list[producerIndex].firstNameProducer));
                        jsonResult.list[producerIndex].lastNameProducer = utf8.decode(crpt.decryptAES(jsonResult.list[producerIndex].lastNameProducer));
                    }
                    res.json({
                        "code" : 0,
                        "message" : "",
                        "result": jsonResult.list
                    });
                }else{
                    res.json({
                        "code" : 3,
                        "message" : "EventParticipant not found"
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
    }
  });
  app.get("/producersGroupEventParticipant/producer/idEvent/", function(req, res, next) {
    if(req.query.idEvent && req.query.token){
        var userId = TokenUtils.getIdAndType(req.query.token).id;
        if (TokenUtils.verifSimpleToken(req.query.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
            res.json({
                "code": 6,
                "message": "Failed to authenticate token",
                "result": null,
            });
        }else{
            var idEvent = req.query.idEvent;
            var query = 'SELECT gep.*, prd.*, usr.loginUser from producersGroupEventParticipant gep, producer prd, user usr where usr.idUser = prd.idUserProducer AND prd.idUserProducer = gep.idUser AND gep.typeParticipant = 1 AND gep.deletedAt IS NULL AND gep.idEvent = '+idEvent+' ;';
            var jsonResult = {};
            var sequelize = models.sequelize;
            var utf8 = require('utf8');
            sequelize.query(query,{ type: sequelize.QueryTypes.SELECT  })
            .then(function(result){
                if(result){
                    jsonResult.code = 0;
                    jsonResult.list = result;
                    for(var producerIndex = 0; producerIndex < jsonResult.list.length; producerIndex++){
                        jsonResult.list[producerIndex].firstNameProducer = utf8.decode(crpt.decryptAES(jsonResult.list[producerIndex].firstNameProducer));
                        jsonResult.list[producerIndex].lastNameProducer = utf8.decode(crpt.decryptAES(jsonResult.list[producerIndex].lastNameProducer));
                    }
                    res.json({
                        "code" : 0,
                        "message" : "",
                        "result": jsonResult.list
                    });
                }else{
                    res.json({
                        "code" : 3,
                        "message" : "EventParticipant not found"
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
    }
  });
  app.get("/producersGroupEventParticipant/idEvent", function(req, res, next) {
    if (req.query.idEvent && req.query.token) {
      var userId = TokenUtils.getIdAndType(req.query.token).id;
      if (TokenUtils.verifProducerToken(req.query.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
        res.json({
          "code": 6,
          "message": "Failed to authenticate token",
          "result": null,
        });
      }else{
        var ProducersGroupSubscriber = models.ProducersGroupSubscriber;
        var request = {
            attributes: ["idParticipant", "idUser", "idEvent", "typeParticipant", "libelleParticipant"],
            where: {
                idEvent: req.query.idEvent
            }
        };
        ProducersGroupSubscriber.findAll(request).then(function (result) {
            if (result) {
            res.json({
                "code": 0,
                "message": "",
                "result": result
            });
            } else {
            res.json({
                "code": 3,
                "message": "ProducersGroupEventParticipants not found"
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
    }
  });
  app.get("/producersGroupEventParticipant/user/idGroup/", function(req, res, next) {
    if(req.query.idGroup && req.query.token){
        var userId = TokenUtils.getIdAndType(req.query.token).id;
        if (TokenUtils.verifSimpleToken(req.query.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
            res.json({
            "code": 6,
            "message": "Failed to authenticate token",
            "result": null,
            });
        }else{
        var idGroup = req.query.idGroup;
        var query = 'SELECT gep.*, usr.loginUser from producersGroupEventParticipant gep, user usr where usr.idUser = gep.idUser AND gep.typeParticipant = 0 AND gep.deletedAt IS NULL AND gep.idGroup = '+idGroup+' ;';
        var jsonResult = {};
        var sequelize = models.sequelize;
        var utf8 = require('utf8');
        sequelize.query(query,{ type: sequelize.QueryTypes.SELECT  })
        .then(function(result){
            if(result){
                jsonResult.code = 0;
                jsonResult.list = result;
                for(var producerIndex = 0; producerIndex < jsonResult.list.length; producerIndex++){
                     jsonResult.list[producerIndex].firstNameProducer = utf8.decode(crpt.decryptAES(jsonResult.list[producerIndex].firstNameProducer));
                     jsonResult.list[producerIndex].lastNameProducer = utf8.decode(crpt.decryptAES(jsonResult.list[producerIndex].lastNameProducer));
                }
                res.json({
                    "code" : 0,
                    "message" : "",
                    "result": jsonResult.list
                });
            }else{
                res.json({
                    "code" : 3,
                    "message" : "EventParticipant not found"
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
    }
  });
  
  app.delete("/producersGroupEventParticipant/id", function (req, res, next) {
      if (req.body.id && req.body.token) {
          var userId = TokenUtils.getIdAndType(req.body.token).id;
          if (TokenUtils.verifProducerToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
              res.json({
                  "code": 6,
                  "message": "Failed to authenticate token",
                  "result": null,
              });
          }else{
            var id = req.body.id;
            var ProducersGroupEventParticipant = models.ProducersGroupEventParticipant;
            ProducersGroupEventParticipant.destroy({
                where: {
                    id: id
                }
            }).then(function (result) {
                if (result) {
                    res.json({
                        "code": 0,
                        "message": "",
                        "result": result
                    });
                } else {
                    res.json({
                        "code": 3,
                        "message": "ProducerGroupEventParticipant not found"
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
      } else {
          res.json({
              "code": 1,
              "message": "Missing required parameters"
          });
      }
  });
};