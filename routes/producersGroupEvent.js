module.exports = function(app, models, TokenUtils, utils) {
  var fs = require("fs");
  const empty = require('empty-folder');
  var CryptoUtils = utils.CryptoUtils;
  var crpt = new CryptoUtils();
  app.post("/producersGroupEvent", function (req, res, next) {
    console.log(req.body);
    if (req.body.description && req.body.location && req.body.city && req.body.adress && req.body.name && req.body.token && req.body.idGroup && req.body.date) {
      var ProducersGroupEvent = models.ProducersGroupEvent;
      var id = null;
      var userId;
      if (req.body.id) {
        id = req.body.id;
      }
      var userId = TokenUtils.getIdAndType(req.body.token).id;
      if (TokenUtils.verifProducerToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
        res.json({
          "code": 6,
          "message": "Failed to authenticate token"
        });

      } else {

        var LatLong = req.body.location.split(',');

        ProducersGroupEvent.create({
          "idEvent": id,
          "idGroup": req.body.idGroup,
          "nameEvent": req.body.name,
          "adressEvent": req.body.adress,
          "cityEvent": req.body.city,
          "locationEvent": req.body.location,
          "latEvent": LatLong[0],
          "longEvent": LatLong[1],
          "descriptionEvent": req.body.description,
          "dateEvent": req.body.date
        }).then(function (result) {
          res.json({
            "code": 0,
            "message": "",
            "result": result.idEvent
          });
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
  app.get("/producersGroupEvent/idGroup/", function(req, res, next) {
    if (req.query.idGroup) {
      var query = 'SELECT (select count(*) from producersGroupEventParticipant gpep where gpep.deletedAt IS NULL AND gpep.idEvent=grpEvent.idEvent) as countParticipants, grpEvent.* from producersGroupEvent grpEvent where grpEvent.deletedAt IS NULL AND grpEvent.dateEvent > sysdate() AND grpEvent.idGroup ='+req.query.idGroup+';';
      var sequelize = models.sequelize;
      sequelize.query(query,{ type: sequelize.QueryTypes.SELECT  })
      .then(function(result){
        if (result) {
          res.json({
            "code": 0,
            "message": "",
            "result": result
          });
        } else {
          res.json({
            "code": 3,
            "message": "Event not found",
            "result": result
          });
        }
      }).catch(function (err) {
        
        res.json({
          "code": 2,
          "message": "Sequelize error",
          "result": result
        });
      });
    }
  });

  app.get("/producersGroupEvent/id/", function(req, res, next) {
    if(req.query.idEvent && req.query.token){
        var userId = TokenUtils.getIdAndType(req.query.token).id;
        if (TokenUtils.verifSimpleToken(req.query.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
            res.json({
            "code": 6,
            "message": "Failed to authenticate token",
            "result": null,
            });
        }else{
            var ProducersGroupEvent = models.ProducersGroupEvent;
            var request = {
                attributes: ['idEvent', 'idGroup', 'nameEvent', 'adressEvent', 'cityEvent', 'locationEvent', 'latEvent', 'longEvent', 'descriptionEvent', 'dateEvent'],  
                where: {
                  idEvent : req.query.idEvent
                }
            };
            ProducersGroupEvent.find(request).then(function(result){
                if(result){
                  res.json({
                    "code" : 0,
                    "message" : "",
                    "result":result
                  });
                }else{
                    res.json({
                        "code" : 3,
                        "message" : "Event not found"
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
  app.delete("/producersGroupEvent/idEvent", function(req, res, next) {
        if(req.body.idEvent && req.body.token){
        var userId = TokenUtils.getIdAndType(req.body.token).id;
        if (TokenUtils.verifProducerToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
          res.json({
            "code": 6,
            "message": "Failed to authenticate token",
            "result": null,
          });
        }else{
          var idEvent = req.body.idEvent;
          var ProducersGroupEvent = models.ProducersGroupEvent;
          ProducersGroupEvent.destroy({
          where: {
            idEvent: idEvent
          } 
          }).then(function(result){
              if(result){
                  res.json({
                    "code": 0,
                    "message": "",
                    "result": result
                  });
              }else{
                  res.json({
                      "code" : 3,
                      "message" : "Producers group not found",
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
        "message": "Missing required parameters",
        "result": null
      });
    }
    });
}