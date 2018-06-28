module.exports = function(app, models, TokenUtils, utils) {
  var fs = require("fs");
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

        if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
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
      });
    } else {
      res.json({
        "code": 1,
        "message": "Missing required parameters"
      });
    }
  });
  app.get("/producersGroup", function(req, res, next) {
        var producerGroup = models.producerGroup;
        var request = {
            attributes: ["id", "founderUserId", "avatar", "name", "email", "phone", "adress", "city", "location", "description"],  
        };
        producerGroup.findAll(request).then(function(result){
            if(result){
                res.json(result);
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
    });
  app.get("/producersGroup/member/userId/", function(req, res, next) {
    if(req.body.token, req.body.loginUser){
      var idUser;
      TokenUtils.findIdUser(req.body.loginUser).then(function (result) {
      idUser = result.idUser;
      var query = 'SELECT grp.*, (select count(id) from producersGroupMember where idGroup = grp.id) as countMembers FROM producersGroup grp, producersGroupMember mbr where mbr.idGroup = grp.id AND mbr.idUser = '+idUser+' ;';
      var jsonResult = {} 
      var sequelize = models.sequelize;
        
      
      sequelize.query(query,{ type: sequelize.QueryTypes.SELECT  })
        .then(function(result){
            if(result){    
              jsonResult.code = 0;
              jsonResult.list = result;          
              res.json(jsonResult);
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
      var query = 'SELECT grp.*, (select count(id) from producersGroupMember where idGroup = grp.id) as countMembers FROM producersGroup grp where grp.founderUserId = '+idUser+' ;';
      var jsonResult = {} 
      var sequelize = models.sequelize;
        
      
      sequelize.query(query,{ type: sequelize.QueryTypes.SELECT  })
        .then(function(result){
            if(result){    
              jsonResult.code = 0;
              jsonResult.list = result;
              res.json(jsonResult);
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
  app.get("/producersGroup/idGroup/", function(req, res, next) {
    if(req.query.idGroup){
        var utf8 = require('utf8');
        var id = req.query.idGroup;
        var coop;
        var query = 'SELECT grp.*, usr.loginUser, prd.lastNameProducer, prd.firstNameProducer, (select count(id) from producersGroupMember where idGroup = grp.id) as countMembers'
        +' FROM producersGroup grp, producer prd, user usr where usr.idUser = prd.idUserProducer AND prd.idUserProducer=grp.founderUserId AND grp.id = '+id+' ;';
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
                  coop : result[0]
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
    }else {
      res.json({
        "code": 1,
        "message": "Missing required parameters"
      });
    }
  });
};