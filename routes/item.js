module.exports = function (app, models, TokenUtils, utils) {
  var fs = require("fs");
  const empty = require('empty-folder');
  
  app.post("/item", function (req, res, next) {
    
    if(req.body.productId && req.body.name && req.body.description && req.body.address && req.body.location && req.body.city){
      console.log("test")
    }
    if (req.body.productId && req.body.name && req.body.description && req.body.address && req.body.location && req.body.city && req.body.cp && req.body.photo && req.body.price && req.body.unitId && req.body.quantity  && req.body.token) {
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

      var LatLong = req.body.location.split(',');
      lat = LatLong[0];
      long = LatLong[1];
      
      userId = TokenUtils.getIdAndType(req.body.token).id;
      Item.create({
        "idItem": id,
        "idProductItem": req.body.productId,
        "nameItem": req.body.name,
        "descriptionItem": req.body.description,
        "addressItem": req.body.address,
        "locationItem": req.body.location,
        "cityItem": req.body.city,
        "cpItem" : req.body.cp,
        "fileExtensionsItem": photosExtensions,
        "priceItem": req.body.price,
        "idUnitItem": req.body.unitId,
        "quantityItem": req.body.quantity,
        "idUserItem": userId,
        "latItem" : lat,
        "longItem" : long
      }).then(function (result) {
        var filePath=null;
        if (req.body.photo != null) {
          for(var imageIndex = 0; imageIndex < req.body.photo.length; imageIndex++){
          (function (imageIndex) { // jshint ignore:line
            filePath = "ressources/itemPhotos/" + result.idItem + "/";
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
          "message":null,
          "result": {
            "id": result.idItem,
            "name": result.nameItem
          }
          
        });
      }).catch(function (err) {
        //console.log(err);
        res.json({
          "code": 2,
          "message": "Sequelize error",
          "result": null,
        });
      });
    } else {
      res.json({
        "code": 1,
        "message": "Missing required parameters",
        "result": null,
      });
    }
  });

  app.post("/item/edit", function (req, res, next) {

    var item = req.body.item;
    if (item.id && req.body.token && item.productId && item.name && item.description && item.address &&
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
          "idProductItem": item.productId,
          "nameItem": item.name,
          "descriptionItem": item.description,
          "addressItem": item.address,
          "locationItem": item.location,
          "cityItem": item.city,
          "fileExtensionsItem": photosExtensions,
          "priceItem": item.price,
          "idUnitItem": item.unitId,
          "quantityItem": item.quantity,
          "idUserItem": userId
        },
        {where: {idItem: item.id} }
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
          "message": null,
          "result": {
            "id": result[0]
          }
        });
      }).catch(function (err) {
        res.json({
          "code": 2,
          "message": "Sequelize error",
          "result": null,
        });
      });
    } else {
      res.json({
        "code": 1,
        "message": "Missing required parameters",
        "result": null,
      });
    }
  });

  app.post("/item/delete", function (req, res, next) {
    if (req.body.id && req.body.token) {
      var Item = models.Item;
      //console.log(photosExtensions);
      userId = TokenUtils.getIdAndType(req.body.token).id;
      Item.destroy({
        force: true,
        where: {
          idItem: req.body.id, 
          idUserItem: userId
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
          "message":null,
          "result": {
            "id": result[0]
          }
        });
      }).catch(function (err) {
        res.json({
          "code": 2,
          "message": "Sequelize error",
          "result": null,
        });
      });
    } else {
      res.json({
        "code": 1,
        "message": "Missing required parameters",
        "result": null,
      });
    }
  });

  app.get("/item", function(req, res, next) {
    if (req.body.idItem || req.query.idItem){
      if(req.query.idItem){
        req.body.idItem = req.query.idItem
      }
      var jsonResult = {} 
      var sequelize = models.sequelize;                      
      sequelize.query("SELECT item.idItem, priceItem, item.addressItem, descriptionItem, locationItem, cityItem, cpItem, quantityItem, item.nameItem, item.fileExtensionsItem, descriptionItem, loginUser, category.nameCategory, product.nameProduct,"
        +"category.idCategory, product.idProduct, unit.idUnit, unit.nameUnit, idProducer, producer.lastNameProducer, producer.firstNameProducer, user.loginUser FROM item, product, category, unit, user, producer WHERE item.idUserItem = producer.idUserProducer "
        +"AND item.idUserItem = user.idUser AND item.idProductItem = product.idProduct AND item.idUnitItem = unit.idUnit AND product.idCategoryProduct = category.idCategory AND item.idItem = :idItem ",{ replacements: { idItem:  req.body.idItem }, type: sequelize.QueryTypes.SELECT  })
        .then(function(result){
            if(result){
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
                res.json({
                  "code":0,
                  "message":null,
                  "result":jsonResult
                });
              }).catch(function(err){
                //console.log(err);
                res.json({
                    "code" : 2,
                    "message" : "Sequelize error",
                    "result": null
                });
              });

            }else{
              res.json({
                "code" : 3,
                "message" : "Item not found",
                "result": null
              });
            }
           
        }).catch(function(err){
            //console.log(err);
            res.json({
                "code" : 2,
                "message" : "Sequelize error",
                "result": null
            });
        });

    }else {
      res.json({
        "code": 1,
        "message": "Missing required parameters",
        "result": null
      });
    }
  });


  app.get("/item/filter", function(req, res, next) {
   

    if(req.query.limit){
      var query = "SELECT item.idItem, priceItem, locationItem, cityItem, cpItem, quantityItem, item.nameItem, item.fileExtensionsItem, descriptionItem, loginUser, category.nameCategory, product.nameProduct,"
      +"category.idCategory, product.idProduct, unit.nameUnit, idProducer "
      if (req.query.lat && req.query.long){ 
        query +=  ", ( 6371 * acos( cos( radians("+req.query.lat+") ) * cos( radians( item.latItem ) )"+
        "* cos( radians(item.longItem) - radians("+req.query.long+")) + sin(radians("+req.query.lat+"))"+ 
        "* sin( radians(item.latItem)))) AS distance "
      }   
      query +="FROM item, product, category, unit, user, producer WHERE item.idUserItem = producer.idUserProducer "
          +"AND item.idUserItem = user.idUser AND item.idProductItem = product.idProduct AND item.idUnitItem = unit.idUnit AND product.idCategoryProduct = category.idCategory and item.deletedAt IS NULL AND quantityItem>0  ";
      
      
      if (req.query.manualSearch){
        //console.log("in")
        query += " AND (item.nameItem LIKE '%"+ req.query.manualSearch+"%' OR product.nameProduct LIKE '%"+ req.query.manualSearch+"%' OR category.nameCategory LIKE '%"+ req.query.manualSearch+"%')";
        
      }
      if (req.query.category && req.query.category !=0 ){
        query += " AND product.idCategoryProduct = "+req.query.category;
      }
      if (req.query.product && req.query.product !=0){
        query += " AND item.idProductItem = "+req.query.product;
      }
      if(req.query.priceMax && req.query.priceMin){
        query += " AND item.priceItem <= "+req.query.priceMax+" AND item.priceItem >= "+req.query.priceMin ;
      }
      if (req.query.lat && req.query.long){
        query += " HAVING distance < 100 ORDER BY distance ";
      }else{
        query += " ORDER BY item.createdAt DESC "
      }
      query += ' LIMIT 20 OFFSET '+req.query.limit+' ;';
      
      var jsonResult = {} 
      var sequelize = models.sequelize;  
      
      sequelize.query("Select COUNT(idItem) as nbTotalItem FROM item",{ type: sequelize.QueryTypes.SELECT  })
        .then(function(result){
          jsonResult.nbTotalItem = result[0].nbTotalItem;
        })
        
      
      sequelize.query(query,{ type: sequelize.QueryTypes.SELECT  })
        .then(function(result){

            if(result){    
              jsonResult.code = 0;
              jsonResult.list = result;   
              res.json({
                "code":0,
                "message": null,
                "result":jsonResult
              });
            }else{
             
              res.json({
                "code" : 3,
                "message" : "Item not found",
                "result": null
              });
            }
           
        }).catch(function(err){
           
            res.json({
                "code" : 2,
                "message" : "Sequelize error",
                "result": null
            });
        });

    }else {
      res.json({
        "code": 1,
        "message": "Missing required parameters",
        "result": null
      });
    }
  });

  
  app.get("/item/verifyQuantity/:itemId", function(req, res, next) {

    if (req.params.itemId){
      var Item = models.Item;
      var request = {
        where: {
          idItem : req.params.itemId
        }
      };
      Item.find(request).then(function(result) { 
        if(result){
          res.json({
            "code": 0,
            "message":"",
            "result" : {
              "quantity" : result.quantityItem,
            }
            
          });
        }else{
          res.json({
            "code": 2,
            "message": "Item does t exist",
            "result": null
          });
        }
      });
    }else{
      res.json({
        "code": 1,
        "message": "Missing required parameters",
        "result": null
      });
    }

  });

  app.post("/item/updateQuantity", function(req, res, next) {
      if(req.body.quantity && req.body.id && req.body.loginUser && req.body.token){
        TokenUtils.findIdUser(req.body.loginUser).then( function(result) {       
          if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
              res.json({
                  "code" : 6,
                  "message" : "Failed to authenticate token",
                  "result": null
              });
          } else {
            var sequelize = models.sequelize;
            sequelize.query("UPDATE item SET quantityItem = quantityItem - "+req.body.quantity+" WHERE idItem = "+req.body.id, { type: sequelize.QueryTypes.UPDATE  }).then(function (results) {
                res.json({
                    "code":0,
                    "message":"Item updated",
                    "result": null
                });
            }).catch(function (err) {
               //console.log(err)
                res.json({
                    "code": 2,
                    "message": "Sequelize error",
                    "result": null
                });
            });


          }   
        }).catch(function (err) {
          res.json({
              "code": 2,
              "message": "Sequelize error",
              "result": null
          });
        });            
      }else{
        res.json({
          "code": 1,
          "message": "Missing required parameters",
          "result": null
        });
      }
     
   })


   app.get("/item/getPriceMinMax", function(req, res, next) { 
      var sequelize = models.sequelize;                      
      sequelize.query("SELECT MAX(priceItem) as maxPrice, MIN(priceItem) as minPrice FROM item",{ type: sequelize.QueryTypes.SELECT  })
        .then(function(result){ 
          res.json({
            "code":0,
            "message":null,
            "result": result[0]
          });
        }).catch(function(err){
          res.json({
            "code": 2,
            "message": "Sequelize error",
            "result": null
          });
        })
   })

}
