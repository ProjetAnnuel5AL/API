module.exports = function(app, models, TokenUtils, utils) {
  var CryptoUtils = utils.CryptoUtils;
  var crpt = new CryptoUtils();
  app.post("/producersGroupMember", function (req, res, next) {
    if(req.body.idGroup && req.body.idUser && req.body.token){
      if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", req.body.idUser) == false) {
        res.json({
          "code": 6,
          "message": "Failed to authenticate token",
          "result": null,
        });
      }else{
        var ProducersGroupMember = models.ProducersGroupMember;
        var id = null;
        if (req.body.id) {
            id = req.body.id;
        }
        ProducersGroupMember.create({
            "id": id,
            "idUser": req.body.idUser,
            "idGroup": req.body.idGroup
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
  app.get("/producersGroupMember/id/", function(req, res, next) {
    if(req.query.id && req.query.token){
        var userId = TokenUtils.getIdAndType(req.query.token).id;
        if (TokenUtils.verifSimpleToken(req.query.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
            res.json({
            "code": 6,
            "message": "Failed to authenticate token",
            "result": null,
            });
        }else{
            var ProducersGroupMember = models.ProducerGroupMember;
            var request = {
                attributes: ["id", "idUser", "idGroup"],  
                where: {
                id : req.query.id
                }
            };
            ProducersGroupMember.findAll(request).then(function(result){
                if(result){
                    res.json(result);
                }else{
                    res.json({
                        "code" : 3,
                        "message" : "Member not found"
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
  app.get("/producersGroupMember/idUser/", function(req, res, next) {
    if(req.query.idUser && req.query.token){
        var userId = TokenUtils.getIdAndType(req.query.token).id;
        if (TokenUtils.verifSimpleToken(req.query.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
            res.json({
            "code": 6,
            "message": "Failed to authenticate token",
            "result": null,
            });
        }else{
            var ProducersGroupMember = models.ProducersGroupMember;
            var request = {
                attributes: ["id", "idUser", "idGroup"],  
                where: {
                idUser : req.query.idUser
                }
            };
            ProducersGroupMember.findAll(request).then(function(result){
                if(result){
                    res.json(result);
                }else{
                    res.json({
                        "code" : 3,
                        "message" : "Member not found"
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
  app.get("/producersGroupMember/idGroup/", function(req, res, next) {
    if(req.query.idGroup){
            var idGroup = req.query.idGroup;
            var query = 'SELECT gpm.*, prd.*, usr.loginUser from producersGroupMember gpm, producer prd, user usr where usr.idUser = prd.idUserProducer AND prd.idUserProducer = gpm.idUser AND gpm.deletedAt IS NULL AND gpm.idGroup = '+idGroup+' ;';
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
                        "message" : "Member not found",
                        "result": null
                    });
                }
            }).catch(function(err){
                console.log(err);
                res.json({
                    "code" : 2,
                    "message" : "Sequelize error",
                    "error" : err
                });
            });D
    }

});

  app.get("/producersGroupMember/idUser/idGroup", function(req, res, next) {
    if(req.query.idGroup && req.query.token){
        var userId = TokenUtils.getIdAndType(req.query.token).id;
        if (TokenUtils.verifSimpleToken(req.query.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
            res.json({
            "code": 6,
            "message": "Failed to authenticate token",
            "result": null,
            });
        }else{
            var ProducersGroupMember = models.ProducersGroupMember;
            var request = {
                attributes: ["id", "idUser", "idGroup"],  
                where: {
                    idGroup : req.query.idGroup,
                    idUser : userId
                }
            };
            ProducersGroupMember.findAll(request).then(function(result){
                if(result && result.length>0){
                    res.json({
                        "code" : 0,
						"result" :null,
                        "message" : ""
                    });
                }else{
                    res.json({
                        "code" : 3,
                        "message" : "Member not found",
                        "result": null
                    });
                }
            }).catch(function (err) {
                console.log(err);
                res.json({
                    "code": 2,
                    "message": "Sequelize error",
                    "result": null
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

  app.delete("/producersGroupMember/idGroup", function (req, res, next) {
      if (req.body.idGroup && req.body.token) {
          var userId = TokenUtils.getIdAndType(req.body.token).id;
          if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
              res.json({
                  "code": 6,
                  "message": "Failed to authenticate token",
                  "result": null,
              });
          }else{
            var idGroup = req.body.idGroup;
            var ProducersGroupMember = models.ProducersGroupMember;
            ProducersGroupMember.destroy({
                where: {
                    idGroup: idGroup
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
                        "message": "ProducerGroupMember not found"
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
  app.delete("/producersGroupMember/id", function (req, res, next) {
      if (req.body.id && req.body.token) {
          var userId = TokenUtils.getIdAndType(req.body.token).id;
          if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
              res.json({
                  "code": 6,
                  "message": "Failed to authenticate token",
                  "result": null,
              });
          }else{
            var id = req.body.id;
            var ProducersGroupMember = models.ProducersGroupMember;
            ProducersGroupMember.destroy({
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
                        "message": "ProducerGroupMember not found"
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