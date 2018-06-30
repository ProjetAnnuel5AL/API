module.exports = function(app, models, TokenUtils, utils) {
  var CryptoUtils = utils.CryptoUtils;
  var crpt = new CryptoUtils();
  app.post("/producersGroupMember", function (req, res, next) {
    if(req.body.idGroup && req.body.idUser && req.body.token){
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
    } else {
      res.json({
        "code": 1,
        "message": "Missing required parameters"
      });
    }
  });
  app.get("/producersGroupMember", function(req, res, next) {
        var ProducersGroupMember = models.ProducersGroupMember;
        var request = {
            attributes: ["id", "idUser", "idGroup"],  
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
    });
  app.get("/producersGroupMember/id/", function(req, res, next) {
    if(req.query.id){
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
  });
  app.get("/producersGroupMember/idUser/", function(req, res, next) {
    if(req.query.idUser){
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
  });
  app.get("/producersGroupMember/idGroup/", function(req, res, next) {
    if(req.query.idGroup){
        var idGroup = req.query.idGroup;
        var query = 'SELECT gpm.*, prd.* from producersgroupmember gpm, producer prd where prd.idUserProducer = gpm.idUser AND gpm.idGroup = '+idGroup+' ;';
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
                res.json(jsonResult);
            }else{
                res.json({
                    "code" : 3,
                    "message" : "Member not found"
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
  app.get("/producersGroupMember/idUser/idGroup", function(req, res, next) {
    if(req.query.idUser && req.query.idGroup){
        var ProducersGroupMember = models.ProducersGroupMember;
        var request = {
            attributes: ["id", "idUser", "idGroup"],  
            where: {
              idGroup : req.query.idGroup,
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
  });
};