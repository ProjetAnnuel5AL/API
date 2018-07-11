module.exports = function(app, models, TokenUtils, utils) {
  var CryptoUtils = utils.CryptoUtils;
  var crpt = new CryptoUtils();
  app.post("/producersGroupSubscriber", function (req, res, next) {
    if(req.body.idGroup && req.body.token){
      var userId = TokenUtils.getIdAndType(req.body.token).id;
      if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
        res.json({
          "code": 6,
          "message": "Failed to authenticate token",
          "result": null,
        });
      }else{
        var ProducersGroupSubscriber = models.ProducersGroupSubscriber;
        var id = null;
        if (req.body.id) {
            id = req.body.id;
        }
        ProducersGroupSubscriber.create({
            "id": id,
            "idUser": userId,
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
  app.get("/producersGroupSubscriber/idGroup", function(req, res, next) {
    if (req.query.idGroup && req.query.token) {
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
            attributes: ["id", "idUser", "idGroup"],
            where: {
            idGroup: req.query.idGroup
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
                "message": "ProducerGroupSubscribers not found"
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
  app.get("/producersGroupSubscriber/idUser/idGroup", function(req, res, next) {
    if (req.query.idGroup && req.query.token) {
      var userId = TokenUtils.getIdAndType(req.query.token).id;
      if (TokenUtils.verifSimpleToken(req.query.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
        res.json({
          "code": 6,
          "message": "Failed to authenticate token",
          "result": null,
        });
      }else{
        var ProducersGroupSubscriber = models.ProducersGroupSubscriber;
        var request = {
            attributes: ["id", "idUser", "idGroup"],
            where: {
            idGroup: req.query.idGroup,
            idUser: userId
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
                "message": "ProducerGroupSubscriber not found"
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
  app.delete("/producersGroupSubscriber/idUser/idGroup", function (req, res, next) {
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
            var ProducersGroupSubscriber = models.ProducersGroupSubscriber;
            ProducersGroupSubscriber.destroy({
                where: {
                    idGroup: idGroup,
                    idUser: userId
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
                        "message": "ProducerGroupSubscriber not found"
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
  app.delete("/producersGroupSubscriber/id", function (req, res, next) {
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
            var ProducersGroupSubscriber = models.ProducersGroupSubscriber;
            ProducersGroupSubscriber.destroy({
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
                        "message": "ProducerGroupSubscriber not found"
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