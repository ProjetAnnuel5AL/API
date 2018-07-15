module.exports = function(app, models, TokenUtils, utils) {
  app.post("/notification/idUser", function(req, res, next) {
    console.log("notifUserCreate");
    if (req.body.idUser && req.body.title && req.body.description && req.body.url && req.body.type && req.body.token) {
      var Notification = models.Notification;
      var userId = TokenUtils.getIdAndType(req.body.token).id;
      if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
        res.json({
          "code": 6,
          "message": "Failed to authenticate token",
          "result": null,
        });
      }else{
        var id = null;
        if (req.body.id) {
          id = req.body.id;
        }
        Notification.create({
              "id": id,
              "idUser": req.body.idUser,
              "title": req.body.title,
              "description": req.body.description,
              "url": req.body.url,
              "type": req.body.type
        }).then(function (result) {
          res.json({
            "code": 0,
            "message": "",
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

  app.post("/notification/multiple", function(req, res, next) {
    console.log("notifUserCreate");
    console.log(req.body);
    if (req.body.notifGroup && req.body.token) {
      var notifGroup = req.body.notifGroup;
      var insertResults = [];
      var Notification = models.Notification;
      var userId = TokenUtils.getIdAndType(req.body.token).id;
      if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
        res.json({
          "code": 6,
          "message": "Failed to authenticate token",
          "result": null
        });
      }else{
        console.log("authenticated");
        for(i=0; i<notifGroup.length; i++){
          var id = null;
          Notification.create({
            "id": id,
            "idUser": notifGroup[i].idUser,
            "title": notifGroup[i].title,
            "description": notifGroup[i].description,
            "url": notifGroup[i].url,
            "type": notifGroup[i].type
          }).then(function (result) {
            insertResults[i] = true;
          }).catch(function (err) {
            insertResults[i] = false;
          });
        }
        console.log(insertResults);
        res.json({
          "code": 0,
          "message": "",
          "id": insertResults
        });
      }
    } else {
      res.json({
        "code": 1,
        "message": "Missing required parameters"
      });
    }
  });


  app.get("/notification/idUser", function(req, res, next) {
        if(req.body.token){
          var userId = TokenUtils.getIdAndType(req.body.token).id;
          if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
            res.json({
              "code": 6,
              "message": "Failed to authenticate token",
              "result": null,
            });
          }else{
          var Notification = models.Notification;
          var request = {
                  attributes: ["id", "idUser", "type", "url", "title", "description"],
                  where: {
                      idUser : userId
                  }
              };
          Notification.findAll(request).then(function(result){
              if(result){
                  res.json({
                    "code": 0,
                    "message": "",
                    "result": result
                  });
              }else{
                  res.json({
                      "code" : 3,
                      "message" : "Notification not found"
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
  app.delete("/notification/idItem", function(req, res, next) {
        if(req.body.id && req.body.token){
        var userId = TokenUtils.getIdAndType(req.body.token).id;
        if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", userId) == false) {
          res.json({
            "code": 6,
            "message": "Failed to authenticate token",
            "result": null,
          });
        }else{
          var id = req.body.id;
          var Notification = models.Notification;
          Notification.destroy({
          force: true,
          where: {
            id: id,
            idUser: userId
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
                      "message" : "Notification not found"
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