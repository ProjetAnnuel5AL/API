require("../env.js");
module.exports = function (app, models, TokenUtils, utils) {

    var sequelize = models.sequelize; 
    var CryptoUtils = utils.CryptoUtils;
    var crpt = new CryptoUtils();
    var config = require("config"); 

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
    var request = require('request');
    username = configPaypal.paypalClientId;
    password = configPaypal.paypalSecret;
    url = configPaypal.paypalUrl;
    auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
    var form = {
        grant_type: 'client_credentials'
    };     
    var formData = querystring.stringify(form);

    //A PASSER EN RP
    //NON FONCTIONNEL EN FRANCE...
    /*app.get("/paypalTransct/redistribute", function (req, res, next) {
        
        
        var items = [];
        
        //Pour la génartion d'id random 
        const crypto = require("crypto");
         

        sequelize.query("SELECT valuePaypalTransact, paypalProducer, itemIdPaypalTransact FROM paypalTransact, producer WHERE paypalTransact.idProducerPaypalTransact=producer.idProducer AND statusPaypalTransact = \"TO DO\" ",{ type: sequelize.QueryTypes.SELECT  })
        .then(function(result) { 
            if (result && result.length>0){
                
                for( var i = 0; i<result.length; i++){
                    var item = {
                        "recipient_type": "EMAIL",
                        "amount": {
                            "value": /*crpt.decryptAES(result[i].valuePaypalTransact/*),
                            "currency": "EUR"
                        },
                        "note": "",
                        "sender_item_id": /*crpt.decryptAES(result[i].itemIdPaypalTransact),
                        "receiver": crpt.decryptAES(result[i].paypalProducer),
                    }
                    items.push(item);
                }
                //A PASSER EN RP
                request(
                    {
                        url : url+"/v1/oauth2/token",
                        method: "POST",
                        headers : {
                            "Authorization" : auth,
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: formData
                    },
                    function (error, response, body) {
                        var jsonBody = JSON.parse(body)
                        var token = jsonBody.access_token;
                        var jsonTransac = {
                            "sender_batch_header": {
                            "sender_batch_id": crypto.randomBytes(16).toString("hex") ,
                            "email_subject": "Reception de paiement."
                            },
                            "items": items
                        }
                        //A PASSER EN RP
                        request(
                            {
                                url : url+"/v1/payments/payouts",
                                method: "POST",
                                headers : {
                                    "Authorization" : "Bearer "+token,
                                    "Content-Type": "application/json"
                                },
                                body : jsonTransac

                            },
                            function (error, response, body) {
                                console.log(body);
                                //mise a jour du batchIdPaypalTransact
                                
                            }
                        );

                    }
                );

            }else{
                res.json({
                    "code" : 1,
                    "message" : "No Pending transaction found" ,
                    "result": null
                })
            }
        })

    });*/

    app.post("/getPaymentToDo", function (req, res, next) {

        if(req.body.token && req.body.loginUser){
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {     
                if (TokenUtils.verifAdminToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result": null
                    });
                   
                } else {    

                    var sequelize = models.sequelize;
                    sequelize.query("SELECT idPaypalTransact, valuePaypalTransact, lastNameProducer, firstNameProducer, idProducer, loginUser, idOrderLigneOrder "
                    +" FROM user, producer, ligneOrder, paypalTransact WHERE user.idUser = producer.idUserProducer AND producer.idProducer = ligneOrder.idProducerLigneOrder "
                    +" AND idLigneOrder = idLigneOrderPaypalTransact AND statusPaypalTransact =\"TO DO\" AND idPaypalTransact",{ type: sequelize.QueryTypes.SELECT  })
                    .then(function(result){
                        if(result && result.length>0){
                            var CryptoUtils = utils.CryptoUtils;
                            var crpt = new CryptoUtils();
                            var utf8 = require('utf8');
                            for(var i =0; i<result.length; i++){
                                result[i].firstNameProducer = utf8.decode(crpt.decryptAES(result[i].firstNameProducer));
                                result[i].lastNameProducer = utf8.decode(crpt.decryptAES(result[i].lastNameProducer));
                            }
                                
                            res.json({
                                "code" : 0,
                                "message" : "" ,
                                "result": result
                            })
                        }else{
                            res.json({
                                "code" : 1,
                                "message" : "No TO DO transaction found" ,
                                "result": null
                            })
                        }
                    }).catch(function(err){
                        console.log(err)
                        res.json({
                            "code" : 2,
                            "message" : "Sequlize Error" ,
                            "result": null
                        })
                    })
                }
            });
        }else{
                res.json({
                    "code" : 1,
                    "message" : "No Pending transaction found" ,
                    "result": null
                })
            }

    })


    app.post("/getPaymentToDoDetails", function (req, res, next) {
        
        if(req.body.token && req.body.loginUser && req.body.transac){
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {     
                if (TokenUtils.verifAdminToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result": null
                    });
                   
                } else {    
                    var query = "";
                    if(Array.isArray(req.body.transac)){
                        var id = ""
                        for(var i =0; i<req.body.transac.length; i++ ){
                            id += ""+req.body.transac[i];
                            if(req.body.transac.length-1 != i){
                                id+= ","
                            }
                        }
                        query = " AND idPaypalTransact IN  (" +id +")"
                    }else{
                        query = " AND idPaypalTransact = " + req.body.transac
                    }

                    var sequelize = models.sequelize;
                    sequelize.query("SELECT idPaypalTransact, valuePaypalTransact, idProducerLigneOrder, emailProducer, lastNameProducer, firstNameProducer, idProducer, loginUser, idOrderLigneOrder "
                    +" FROM user, producer, ligneOrder, paypalTransact WHERE user.idUser = producer.idUserProducer AND producer.idProducer = ligneOrder.idProducerLigneOrder "
                    +" AND idLigneOrder = idLigneOrderPaypalTransact AND statusPaypalTransact =\"TO DO\" " + query,{ type: sequelize.QueryTypes.SELECT  })
                    .then(function(result){
                        if(result && result.length>0){
                            var CryptoUtils = utils.CryptoUtils;
                            var crpt = new CryptoUtils();
                            var utf8 = require('utf8');
                            for(var i =0; i<result.length; i++){
                                result[i].emailProducer = utf8.decode(crpt.decryptAES(result[i].emailProducer));
                                result[i].firstNameProducer = utf8.decode(crpt.decryptAES(result[i].firstNameProducer));
                                result[i].lastNameProducer = utf8.decode(crpt.decryptAES(result[i].lastNameProducer));
                            }
                                
                            res.json({
                                "code" : 0,
                                "message" : "" ,
                                "result": result
                            })
                        }else{
                            res.json({
                                "code" : 1,
                                "message" : "No TO DO transaction found" ,
                                "result": null
                            })
                        }
                    }).catch(function(err){
                        res.json({
                            "code" : 2,
                            "message" : "Sequlize Error" ,
                            "result": null
                        })
                    })
                }
            });
        }else{
                res.json({
                    "code" : 1,
                    "message" : "No Pending transaction found" ,
                    "result": null
                })
            }

    })


    

    app.post("/getPaymentToDoToSuccessDetails", function (req, res, next) {
        
        if(req.body.token && req.body.loginUser && req.body.transac){
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {     
                if (TokenUtils.verifAdminToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result": null
                    });
                   
                } else {    
                    var query = "";
                    if(Array.isArray(req.body.transac)){
                        var id = ""
                        for(var i =0; i<req.body.transac.length; i++ ){
                            id += ""+req.body.transac[i];
                            if(req.body.transac.length-1 != i){
                                id+= ","
                            }
                        }
                        query = " WHERE idPaypalTransact IN  (" +id +")"
                    }else{
                        query = " WHERE idPaypalTransact = " + req.body.transac
                    }
                    var d = new Date();
                    var dStr = ""+d.getFullYear() +"-"+ (d.getMonth()+1) +"-"+ d.getDate()  

                    var sequelize = models.sequelize;
                    sequelize.query("UPDATE paypalTransact SET statusPaypalTransact =\"SUCCESS\", dateRediPaypalTransact = \""+ dStr+ "\" "+ query)
                    .spread((results, metadata) => {
                        res.json({
                            "code" : 0,
                            "message" : "" ,
                            "result": null
                        })
                    }).catch(function(err){
                        res.json({
                            "code" : 2,
                            "message" : "Sequlize Error" ,
                            "result": null
                        })
                    })
                }
            });
        }else{
                res.json({
                    "code" : 1,
                    "message" : "No Pending transaction found" ,
                    "result": null
                })
            }

    })

  
    app.post("/getIban", function (req, res, next) { 
        if(req.body.token && req.body.loginUser && req.body.idProducer){
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {     
                if (TokenUtils.verifAdminToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result": null
                    });
                   
                } else {    
                    //on recup le nom 
                    var request = {
                        attributes: ["ibanProducer"],
                        where: {
                            idProducer : req.body.idProducer
                        }
                    };
                    var Producer = models.Producer;
                    Producer.find(request).then(function(result){
                        if(result){
                            var CryptoUtils = utils.CryptoUtils;
                            var crpt = new CryptoUtils();
                            var filePath = "ressources/ibanProducer/";
                            var ext = result.ibanProducer.split('.');
                            var nameCrypt ="";
                            for (var i =0; i<ext.length-1; i++){
                                nameCrypt += ext[i];
                            }
                            nameCrypt = filePath + nameCrypt; 
                            crpt.decryptFileAES(nameCrypt);
                            console.log(nameCrypt)
                            res.json({
                                "code" : 0,
                                "message" :"" ,
                                "result":  nameCrypt +".pdf"
                            })
                            
                           

                        }else{
                            res.json({
                                "code" : 3,
                                "message" : "Not found" ,
                                "result": null
                            })
                        }

                    }).catch(function(err){
                        console.log(err)
                        res.json({
                            "code" : 2,
                            "message" : "Sequlize Error" ,
                            "result": null
                        })
                    })
                }
            })

        }else{
            res.json({
                "code" : 1,
                "message" : "No Pending transaction found" ,
                "result": null
            })
        }
    })


    app.post("/deleteIbanCrypt", function (req, res, next) { 
        if(req.body.token && req.body.loginUser && req.body.idProducer){
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {     
                if (TokenUtils.verifAdminToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result": null
                    });
                   
                } else {    
                    //on recup le nom 
                    var request = {
                        attributes: ["ibanProducer"],
                        where: {
                            idProducer : req.body.idProducer
                        }
                    };
                    var Producer = models.Producer;
                    Producer.find(request).then(function(result){
                        if(result){
                            var CryptoUtils = utils.CryptoUtils;
                            var crpt = new CryptoUtils();
                            var filePath = "ressources/ibanProducer/";
                            var ext = result.ibanProducer.split('.');
                            var nameCrypt ="";
                            for (var i =0; i<ext.length-1; i++){
                                nameCrypt += ext[i];
                            }
                            nameCrypt = filePath + nameCrypt; 
                            var fs = require('fs');
                            fs.unlink(nameCrypt+".pdf");
                            console.log(nameCrypt)
                            res.json({
                                "code" : 0,
                                "message" :"decrypt delete" ,
                                "result": null
                            })
                            
                           

                        }else{
                            res.json({
                                "code" : 3,
                                "message" : "Not found" ,
                                "result": null
                            })
                        }

                    }).catch(function(err){
                        //console.log(err)
                        res.json({
                            "code" : 2,
                            "message" : "Sequlize Error" ,
                            "result": null
                        })
                    })
                }
            })

        }else{
            res.json({
                "code" : 1,
                "message" : "No Pending transaction found" ,
                "result": null
            })
        }
    })

    app.get("/updatePendingToTodoCron", function(req, res, next){
        
        var PaypalTransact = models.PaypalTransact;

        var request = {
            attributes: ["idPaypalTransact", "datePaypalTransact"],
            where: {
                statusPaypalTransact : "PENDING",
            }
        }

        PaypalTransact.findAll(request).then(function(result){
            if(result && result.length>0){
                for(var i =0; i<result.length; i++){
                    var WNbJours = new Date().getTime() - result[i].datePaypalTransact.getTime();
                    if(Math.ceil(WNbJours/(1000*60*60*24)>14)){
                        
                        var attributes = {}
                        attributes.statusPaypalTransact = "TO DO";
                        var request2 = {
                            where: {
                                idPaypalTransact : result[i].idPaypalTransact,
                            }
                        } 
                        PaypalTransact.update(attributes, request2).then(function (results) {                      
                        }).catch(function (err) {
                        
                        });
                    }                 
                }
                res.json({
                    "code" : 0,
                    "message" : "DONE" ,
                    "result": null
                })
            }else{
                res.json({
                    "code" : 3,
                    "message" : "0 transac" ,
                    "result": null
                })
            }


        }).catch(function(err){
           
            res.json({
                "code" : 2,
                "message" : "Sequlize Error" ,
                "result": null
            });
        });

    });

    
    app.post("/getPaymentRefund", function(req, res, next){
        
        if(req.body.token && req.body.loginUser){
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {     
                if (TokenUtils.verifAdminToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result": null
                    });
                   
                } else {    
                    var sequelize = models.sequelize;
                    sequelize.query("SELECT idPaypalTransact, datePaypalTransact, batchIdPaypalTransact, payerIDPaypalTransact, itemIdPaypalTransact,  valuePaypalTransact, idProducerLigneOrder, emailProducer, lastNameProducer, firstNameProducer, idProducer, loginUser, idOrderLigneOrder "
                    +" FROM user, producer, ligneOrder, paypalTransact WHERE user.idUser = producer.idUserProducer AND producer.idProducer = ligneOrder.idProducerLigneOrder "
                    +" AND idLigneOrder = idLigneOrderPaypalTransact AND statusPaypalTransact =\"REFUND\" " ,{ type: sequelize.QueryTypes.SELECT  })
                   .then(function (result){
                        if(result && result.length>0){
                            var CryptoUtils = utils.CryptoUtils;
                            var crpt = new CryptoUtils();
                            var utf8 = require('utf8');
                            for(var i =0; i<result.length; i++){
                                result[i].payerIDPaypalTransact = utf8.decode(crpt.decryptAES(result[i].payerIDPaypalTransact));
                            } 
                            res.json({
                                "code" : 0,
                                "message" : "" ,
                                "result": result
                            });
                        }else{
                            res.json({
                                "code" : 0,
                                "message" : "No pending" ,
                                "result": null
                            });

                        }  
                   }).catch(function(err){
                        res.json({
                            "code" : 2,
                            "message" : "Sequlize Error" ,
                            "result": null
                        });
                   }) 
                }
            })

        }else{
            res.json({
                "code" : 1,
                "message" : "No Pending transaction found" ,
                "result": null
            })
        }
    });

    
    app.post("/paymentRefundToSucces", function(req, res, next){
        
        if(req.body.token && req.body.loginUser && req.body.transac){
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {     
                if (TokenUtils.verifAdminToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result": null
                    });
                   
                } else {    
                    var query = "";
                    query = " WHERE idPaypalTransact = " + req.body.transac
                    
                    var d = new Date();
                    var dStr = ""+d.getFullYear() +"-"+ (d.getMonth()+1) +"-"+ d.getDate()  

                    var sequelize = models.sequelize;
                    sequelize.query("UPDATE paypalTransact SET statusPaypalTransact =\"SUCCESS\" "+ query)
                    .spread((results, metadata) => {
                        res.json({
                            "code" : 0,
                            "message" : "" ,
                            "result": null
                        })
                    }).catch(function(err){
                        res.json({
                            "code" : 2,
                            "message" : "Sequlize Error" ,
                            "result": null
                        })
                    })
                }
            });
        }else{
            res.json({
                "code" : 1,
                "message" : "No Pending transaction found" ,
                "result": null
            })
        }

    });

}