module.exports = function (app, models, TokenUtils, utils) {

    var config = require("config"); 
    var utf8 = require('utf8');
    var fs = require("fs");

    var configPaypal;
    var log =true;
    if (process.env.NODE_ENV === "test") {
        configPaypal =	config.get("test");
        log =false;
    } else if(process.env.NODE_ENV === "development") {
        configPaypal = config.get("development");
    } else if(process.env.NODE_ENV === "production"){
        configPaypal = config.get("production");
    }

    var querystring = require('querystring');
    var rp = require("request-promise");

    username = configPaypal.paypalClientId;
    password = configPaypal.paypalSecret;
    url = configPaypal.paypalUrl;
    auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
    var form = {
        grant_type: 'client_credentials'
    };   
    var formData = querystring.stringify(form);


    app.post("/order", function (req, res, next) {
        if(req.body.loginUser && req.body.token && req.body.cart && req.body.payementDetail && req.body.address){
            //On commence par vérifier si il y a bien eu un paiement. 
            //Si pas de paiement pas d'enregistrement.
            var CryptoUtils = utils.CryptoUtils;
            var crpt = new CryptoUtils();
            var Order = models.Order;
            var LigneOrder = models.LigneOrder;
            var PaypalTransact = models.PaypalTransact 
            var idOrder;
            var FinderUtils = utils.FinderUtils;

            var totalOrder = 0.00;
            for(var i = 0; i<req.body.cart.length; i++){
                totalOrder += (req.body.cart[i].prixU*parseInt(req.body.cart[i].qte));
            }

            rp({
                url : url+"/v1/oauth2/token",
                method: "POST",
                headers : {
                    "Authorization" : auth,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: formData
            }).then(function(result){
                var jsonBody = JSON.parse(result)
                var tokenPaypal = jsonBody.access_token;
                rp({
                    url : url+"/v1/payments/payment?count=1&start_id="+req.body.payementDetail.paymentID,
                    method: "GET",
                    headers : {
                        "Authorization" : "Bearer " + tokenPaypal,
                        "Content-Type": "application/json"
                    }
                }).then(function(result2){ 
                    var verifyPaymentJson = JSON.parse(result2)
                    //si un paiement exist on enregistre la commande.
                    if(verifyPaymentJson.count == 1){
                        if(verifyPaymentJson.payments[0].state=="approved"){
                            //Si on arrive ici tout est bon pour paypal : paiement OK
                            //création de la commande
                            TokenUtils.findIdUser(req.body.loginUser).then(function(result) {
                                Order.create({
                                    "idUserOrder": result.idUser,
                                    "dateOrder": new Date(),
                                    "lastNameOrder": crpt.encryptAES(req.body.address.lastNameUser),
                                    "firstNameOrder": crpt.encryptAES(req.body.address.firstNameUser),
                                    "sexOrder": crpt.encryptAES(req.body.address.sexUser),
                                    "addressOrder": crpt.encryptAES(req.body.address.addressUser),
                                    "cityOrder": crpt.encryptAES(req.body.address.cityUser),
                                    "cpOrder": crpt.encryptAES(req.body.address.cpUser),
                                    "totalOrder" : totalOrder.toFixed(2),
                                    "idPaypalPaiement": crpt.encryptAES(req.body.payementDetail.paymentID)
                                }).then(function (result) { 
                                    idOrder = result.idOrder;
                                    
                                    for(var i = 0; i<req.body.cart.length; i++){
                                        //on recup l'id producer de l'item
                                        //On passe tout le cart qu'on va également renvoyer pour gérer l'async
                                        FinderUtils.FindProducerIdWithCart(req.body.cart[i]).then(function(result) { 
                                            //Création des lignes de la commande          
                                            LigneOrder.create({
                                                "idOrderLigneOrder": idOrder,
                                                "idProducerLigneOrder": result.idProducer,
                                                "idItemLigneOrder": result.cart.id,
                                                "unitLigneOrder": result.cart.unit,
                                                "categoryLigneOrder": result.cart.category,
                                                "productLigneOrder": result.cart.product,
                                                "titleLigneOrder": result.cart.title,
                                                "quantiteLigneOrder": result.cart.qte,
                                                "prixUnitaireLigneOrder": (result.cart.prixU*1).toFixed(2),
                                            }).then(function(result){
                                                //Création d'une transaction de redistribution paypal
                                                PaypalTransact.create({
                                                    "idLigneOrderPaypalTransact": result.idLigneOrder,
                                                    "datePaypalTransact": new Date(),
                                                    "dateRediPaypalTransact": null,
                                                    "payerIDPaypalTransact": crpt.encryptAES(req.body.payementDetail.payerID),
                                                    "valuePaypalTransact": (result.quantiteLigneOrder*result.prixUnitaireLigneOrder).toFixed(2),
                                                    //batch et item id sera update lors de la transaction 
                                                    "batchIdPaypalTransact": null,
                                                    "itemIdPaypalTransact": null,
                                                    "statusPaypalTransact": "PENDING",
                                                })
                                            })  
                                        })
                                    }
                                })

                                
                            })

                            

                            res.json({
                                "code" : 0,
                                "message": "Order saved",
                                "result": null
                            })

                        }else{
                            res.json({
                                "code" : 2,
                                "message": "Payment not approuved",
                                "result": null
                            })
                        }
                    }else{
                        res.json({
                            "code" : 2,
                            "message": "No Payment found",
                            "result": null
                        })
                    }
                })
            })   
        }else{
            res.json({
                "code" : 1,
                "message" : "Missing required parameters",
                "result": null
            });
        }
    })

    
    app.get("/order/getOdrersFromUser", function (req, res, next) { 
        if(req.body.loginUser && req.body.token){
            var orders;
            var status = [];
            var FinderUtils = utils.FinderUtils;
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {       
                if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result": null
                    });
                    
                } else {  
                    
                    var Order = models.Order;
                    var sequelize = models.sequelize;
                    var request = {
                        attributes: ["idOrder", "dateOrder", "totalOrder"],
                        where: {
                            idUserOrder : result.idUser
                        },
                        order: [
                            ['dateOrder', 'DESC'],
                        ]
                    };

                    Order.findAll(request).then(function(result){ 
                        if(result && result.length>0){
                            orders=result
                           
                            //On recup le status
                            //Si encore des lignes en PENDIG : statut = attente de reception reste a valider sinon statut = receptionner
                            for(var i=0; i<orders.length; i++){
                                orders[i].statusOrder="";
                                FinderUtils.FindStatusOrder(orders[i], i).then(function(result2){
                                    if(result2.statusOrder){
                                        status[result2.i] = result2.statusOrder
                                    }else{
                                        status[result2.i] = "Statut temporairement indisponible."
                                    }
                                    
                                   if((result2.i+1) == orders.length){
                                      
                                        res.json({
                                            "code" :0,
                                            "message":null,
                                            "result" : {
                                                "orders" : orders,
                                                "status" : status,
                                            }
                                        });
                                   }
                                })
                               
                            }        
                        }else{
                            res.json({
                                "code": 1,
                                "message": "No Order",
                                "result": null
                            });
                        }
                    })
                    
    
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
                "code" : 1,
                "message" : "Missing required parameters",
                "result": null
            });
        }
    });

    app.get("/order/getOrderDetailsFromuser", function (req, res, next) { 
        if(req.body.loginUser && req.body.token && req.body.idOrder){
            var sequelize = models.sequelize;
            var idUser;
            var CryptoUtils = utils.CryptoUtils;
            var crpt = new CryptoUtils();
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {
                idUser = result.idUser;  
                if (TokenUtils.verifUserOrderToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser, req.body.idOrder ) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token"
                    });
                } else {  
                    //"SELECT idOrder, dateOrder, totalOrder, unitLigneOrder, categoryLigneOrder, productLigneOrder, titleLigneOrder, quantiteLigneOrder, prixUnitaireLigneOrder, statusPaypalTransact, idProducer, emailProducer, lastNameProducer, firstNameProducer, loginUser FROM `order`, ligneOrder, paypalTransact, producer, user WHERE `order`.idOrder = ligneOrder.idOrderLigneOrder AND ligneOrder.idLigneOrder = paypalTransact.idLigneOrderPaypalTransact AND ligneOrder.idProducerLigneOrder = producer.idProducer AND producer.idUserProducer = user.idUser WHERE order.idUserOrder = "+idUser+" AND idOrder = "+req.body.idOrder
                    sequelize.query("SELECT idOrder, dateOrder, totalOrder, idLigneOrder, unitLigneOrder, categoryLigneOrder, productLigneOrder, titleLigneOrder, quantiteLigneOrder, prixUnitaireLigneOrder, statusPaypalTransact, idProducer, emailProducer, lastNameProducer, firstNameProducer, loginUser FROM `order`, ligneOrder, paypalTransact, producer, user WHERE `order`.idOrder = ligneOrder.idOrderLigneOrder AND ligneOrder.idLigneOrder = paypalTransact.idLigneOrderPaypalTransact AND ligneOrder.idProducerLigneOrder = producer.idProducer AND producer.idUserProducer = user.idUser AND order.idUserOrder = "+idUser+" AND idOrder = "+req.body.idOrder, { type: sequelize.QueryTypes.SELECT  }).then(function (results) {
                        if(results && results.length>0){

                            //On déchiffre les infos avant de send
                            for(var i =0; i<results.length; i++){
                                results[i].lastNameProducer = utf8.decode(crpt.decryptAES(results[i].lastNameProducer));
                                results[i].firstNameProducer = utf8.decode(crpt.decryptAES(results[i].firstNameProducer));
                            }

                            res.json({
                                "code": 0,
                                "message": null,
                                "result": results,
                            });
                        }else{
                            res.json({
                                "code": 1,
                                "message": "No order",
                                "result": null
                                
                            });
                        }
                    }).catch(function (err) {
                       console.log(err)
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
                "code" : 1,
                "message" : "Missing required parameters",
                "result": null
            });
        }
    });


   

    app.get("/order/validateReceptionFromUser", function (req, res, next) { 
        if(req.body.loginUser && req.body.token && req.body.idOrder && req.body.idLigneOrder){
            var idUser;
            var CryptoUtils = utils.CryptoUtils;
            var crpt = new CryptoUtils();
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {
                idUser = result.idUser;  
                if (TokenUtils.verifUserOrderToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser, req.body.idOrder ) == false) { 
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token"
                    });
                }else{
                    var PaypalTransact = models.PaypalTransact;
                    var request = {
                        "where": {
                            idLigneOrderPaypalTransact: req.body.idLigneOrder,
                            statusPaypalTransact: "PENDING"
                        }
                    };
                    var attributes = {};
                    attributes.statusPaypalTransact ="TO DO";
                    PaypalTransact.update(attributes, request).then(function (results) { 
                        res.json({
                            "code" : 0,
                            "message" : "statut updated"
                        })
                    }).catch(function(err){
                        res.json({
                            "code": 2,
                            "message": "Sequelize error",
                            "error": err
                        });
                    })
                }
            }).catch(function (err) {
                res.json({
                    "code": 2,
                    "message": "Sequelize error",
                    "error": err
                });
            });  
        }else{
            res.json({
                "code" : 1,
                "message" : "Missing required parameters"
            });
        }
    })

    app.get("/order/getBillFromUser", function (req, res, next) { 
        if(req.body.loginUser && req.body.token && req.body.idOrder){
            var sequelize = models.sequelize;
            var idUser;
            var CryptoUtils = utils.CryptoUtils;
            var crpt = new CryptoUtils();
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {
                idUser = result.idUser;  
                if (TokenUtils.verifUserOrderToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser, req.body.idOrder ) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token"
                    });
                } else {  
                    //"SELECT idOrder, dateOrder, totalOrder, unitLigneOrder, categoryLigneOrder, productLigneOrder, titleLigneOrder, quantiteLigneOrder, prixUnitaireLigneOrder, statusPaypalTransact, idProducer, emailProducer, lastNameProducer, firstNameProducer, loginUser FROM `order`, ligneOrder, paypalTransact, producer, user WHERE `order`.idOrder = ligneOrder.idOrderLigneOrder AND ligneOrder.idLigneOrder = paypalTransact.idLigneOrderPaypalTransact AND ligneOrder.idProducerLigneOrder = producer.idProducer AND producer.idUserProducer = user.idUser WHERE order.idUserOrder = "+idUser+" AND idOrder = "+req.body.idOrder
                    sequelize.query("SELECT idOrder, dateOrder, totalOrder, idLigneOrder, unitLigneOrder, categoryLigneOrder, productLigneOrder, titleLigneOrder, quantiteLigneOrder, prixUnitaireLigneOrder, statusPaypalTransact, idProducer, emailProducer, lastNameProducer, firstNameProducer, loginUser FROM `order`, ligneOrder, paypalTransact, producer, user WHERE `order`.idOrder = ligneOrder.idOrderLigneOrder AND ligneOrder.idLigneOrder = paypalTransact.idLigneOrderPaypalTransact AND ligneOrder.idProducerLigneOrder = producer.idProducer AND producer.idUserProducer = user.idUser AND order.idUserOrder = "+idUser+" AND idOrder = "+req.body.idOrder, { type: sequelize.QueryTypes.SELECT  }).then(function (results) {
                        if(results && results.length>0){

                            //On déchiffre les infos avant de send
                            for(var i =0; i<results.length; i++){
                                results[i].lastNameProducer = utf8.decode(crpt.decryptAES(results[i].lastNameProducer));
                                results[i].firstNameProducer = utf8.decode(crpt.decryptAES(results[i].firstNameProducer));
                            }

                            var PdfGeneratorUtils = utils.PdfGeneratorUtils;
                            PdfGeneratorUtils.PDFBillUser();
                            res.json({
                                "code": 2,
                                "message": "Sequelize error",
                                "error": err
                            });
                        }else{
                            res.json({
                                "code": 1,
                                "message": "No order",
                                
                            });
                        }
                    }).catch(function (err) {
                        res.json({
                            "code": 2,
                            "message": "Sequelize error",
                            "error": err
                        });
                    });
                }
            }).catch(function (err) {
                
                res.json({
                    "code": 2,
                    "message": "Sequelize error",
                    "error": err
                });
            });  

        }else{
            res.json({
                "code" : 1,
                "message" : "Missing required parameters"
            });
        }

        
    })
   
   
};