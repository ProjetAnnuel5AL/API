module.exports = function (app, models, TokenUtils) {
  var fs = require("fs");
  const empty = require('empty-folder');
  app.post("/item", function (req, res, next) {
    
    if(req.body.productId && req.body.name && req.body.description && req.body.adress && req.body.location && req.body.city){
      console.log("test")
    }
    if (req.body.productId && req.body.name && req.body.description && req.body.adress && req.body.location && req.body.city && req.body.photo && req.body.price && req.body.unitId && req.body.quantity  && req.body.token) {
      var Item = models.Item;
      var id = null;
      var userId;
      if (req.body.id) {
        id = req.body.id;
      }
      var photosExtensions = "";
      photosExtensions += req.body.photo[0].name.split('.')[1]+";";
      if(req.body.photo[1]){
        photosExtensions += req.body.photo[1].name.split('.')[1]+";";
        if(req.body.photo[2]){
          photosExtensions += req.body.photo[2].name.split('.')[1];
        }
      }
      
      userId = TokenUtils.getIdAndType(req.body.token).id;
      Item.create({
        "id": id,
        "idProduct": req.body.productId,
        "name": req.body.name,
        "description": req.body.description,
        "adress": req.body.adress,
        "location": req.body.location,
        "city": req.body.city,
        "fileExtensions": photosExtensions,
        "price": req.body.price,
        "unitId": req.body.unitId,
        "quantity": req.body.quantity,
        "idUser": userId
      }).then(function (result) {
        var filePath=null;
        if (req.body.photo != null) {
          for(var imageIndex = 0; imageIndex < req.body.photo.length; imageIndex++){
          (function (imageIndex) { // jshint ignore:line
            filePath = "ressources/itemPhotos/" + result.id + "/";
            if (!fs.existsSync(filePath)) {
              fs.mkdirSync(filePath);
            }

            var extension = req.body.photo[imageIndex].name.split('.');
            var oldpath = req.body.photo[imageIndex].path;
            var newpath = filePath + imageIndex + "." + extension[extension.length - 1];

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
            })(imageIndex);
          }
        }
        res.json({
          "code": 0,
          "id": result.id,
          "name": result.name
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

  app.post("/item/edit", function (req, res, next) {
    console.log(req.body);
    var item = req.body.item;
    if (item.id && req.body.token && item.productId && item.name && item.description && item.adress &&
    item.location && req.body.photo && item.price && item.unitId && item.quantity && item.city) {
      var Item = models.Item;
      var userId;
      var photosExtensions = "";
      if (req.body.photo[0].size != 0) {
        photosExtensions += req.body.photo[0].name.split('.')[1]+";";
        if(req.body.photo[1]){
          photosExtensions += req.body.photo[1].name.split('.')[1]+";";
          if(req.body.photo[2]){
            photosExtensions += req.body.photo[2].name.split('.')[1];
          }
        }
      }else photosExtensions = item.fileExtensions;
      //console.log(photosExtensions);
      userId = TokenUtils.getIdAndType(req.body.token).id;
      Item.update({
          "idProduct": item.productId,
          "name": item.name,
          "description": item.description,
          "adress": item.adress,
          "location": item.location,
          "city": item.city,
          "fileExtensions": photosExtensions,
          "price": item.price,
          "unitId": item.unitId,
          "quantity": item.quantity,
          "idUser": userId
        },
        {where: {id: item.id} }
      )
      .then(function(result) {
        var filePath=null;
        if (req.body.photo[0].size != 0) {
          for(var imageIndex = 0; imageIndex < req.body.photo.length; imageIndex++){
          (function (imageIndex) { // jshint ignore:line
            filePath = "ressources/itemPhotos/" + result[0] + "/";
            if (!fs.existsSync(filePath)) {
              fs.mkdirSync(filePath);
            }
            empty(filePath, false, (o)=>{
              if(o.error) console.error(err);
              //console.log(o.removed);
              //console.log(o.failed);
            });
            var extension = req.body.photo[imageIndex].name.split('.');
            var oldpath = req.body.photo[imageIndex].path;
            var newpath = filePath + imageIndex + "." + extension[extension.length - 1];

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
            })(imageIndex);
          }
        }
        res.json({
          "code": 0,
          "id": result[0]
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

  app.post("/item/delete", function (req, res, next) {
    console.log(req.body);
    if (req.body.id && req.body.token) {
      var Item = models.Item;
      //console.log(photosExtensions);
      userId = TokenUtils.getIdAndType(req.body.token).id;
      Item.destroy({
        force: true,
        where: {
          id: req.body.id, 
          idUser: userId
        } 
      })
      .then(function(result) {
        var filePath = null;
        filePath = "ressources/itemPhotos/" + req.body.id + "/";
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath);
        }
        empty(filePath, true, (o) => {
          if (o.error) console.error(err);
          //console.log(o.removed);
          //console.log(o.failed);
        });
        res.json({
          "code": 0,
          "id": result[0]
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

  app.get("/item", function(req, res, next) {
    if (req.body.idItem){
     
      var jsonResult = {} 
      var sequelize = models.sequelize;                      
      sequelize.query("SELECT item.id, price, item.adress, description, location, city, quantity, item.name as itemName, item.fileExtensions, description, loginUser, category.name as categoryName, product.name as productName,"
        +"category.id as categId, product.id as productId, unit.id as unitId, unit.name as unitName, idProducer, producer.lastNameProducer as producerName, producer.firstNameProducer as producerFirstName, user.loginUser as login FROM item, product, category, unit, user, producer WHERE item.idUser = producer.idUserProducer "
        +"AND item.idUser = user.idUser AND item.idProduct = product.id AND item.unitId = unit.id AND product.categoryId = category.id AND item.id = :idItem ",{ replacements: { idItem:  req.body.idItem }, type: sequelize.QueryTypes.SELECT  })
        .then(function(result){
            if(result){
              jsonResult.code = 0;
              jsonResult.infoItem = result[0];
              //A changer pour le multi upload
              jsonResult.infoItem.photoURL = "default";
              //pour récup les étoiles
              var CommentProducer = models.CommentProducer
              var request = {
                attributes: ["starComment"],
                where: {
                  idProducer : jsonResult.infoItem.idProducer
                }
              };
              CommentProducer.findAll(request).then(function(result2){
                jsonResult.stars = result2
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
                "message" : "Item not found"
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

    }else {
      res.json({
        "code": 1,
        "message": "Missing required parameters"
      });
    }
  });


  app.get("/item/filter", function(req, res, next) {
    var query = "SELECT item.id, price, location, city, quantity, item.name as itemName, item.fileExtensions, description, loginUser, category.name as categoryName, product.name as productName,"
        +"category.id as categId, product.id as productId, unit.name as unitName, idProducer, producer.lastNameProducer as producerName, producer.firstNameProducer as producerFirstName, user.loginUser as login FROM item, product, category, unit, user, producer WHERE item.idUser = producer.idUserProducer "
        +"AND item.idUser = user.idUser AND item.idProduct = product.id AND item.unitId = unit.id AND product.categoryId = category.id and item.deletedAt IS NULL ORDER BY Item.createdAt DESC ";
    
    if (req.query.productId){
      query += " AND item.idProduct = "+ req.query.productId;
    }else{
      if (req.query.categoryId){
        query += " AND category.id = "+ req.query.categoryId;
      }
    }
    if(req.query.priceMin && req.query.priceMax){
      query += " AND item.price BETWEEN "+ req.query.priceMin + " AND "+ req.query.priceMax;
    }
    if(req.query.city){
      query += " AND item.city ='" +req.query.city+"'";
    }
    if(req.query.remainingQuantity){
      query += " AND item.quantity > " +req.query.remainingQuantity;
    }
    if(req.query.producerId){
      query += " AND item.idUser = "+ req.query.producerId;
    }
    if(req.query.limit){
      query += ' LIMIT 20 OFFSET '+req.query.limit+' ;';
      var jsonResult = {} 
      var sequelize = models.sequelize;  
      //console.log("QUERY:");
      //console.log(query); 
      sequelize.query("Select COUNT(id) as nbTotalItem FROM item",{ type: sequelize.QueryTypes.SELECT  })
        .then(function(result){
          jsonResult.nbTotalItem = result[0].nbTotalItem;
        })
        
      
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

    }else {
      res.json({
        "code": 1,
        "message": "Missing required parameters"
      });
    }
  });
}
