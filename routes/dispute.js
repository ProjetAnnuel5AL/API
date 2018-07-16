module.exports = function(app, models, TokenUtils, utils, urlApi, urlSite) {

    var utf8 = require('utf8');

    app.post("/dispute", function(req, res, next) { 
        if(req.body.token && req.body.loginUser && req.body.idMotif && req.body.idLigneOrder && req.body.descriptionDispute && req.body.idOrder){
            var Dispute = models.Dispute;
            var DisputeLigneOrder = models.DisputeLigneOrder;
            var PaypalTransact = models.PaypalTransact;
            var idUser;
            var idDispute;
            var sequelize = models.sequelize;
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
                    Dispute.create({
                        "dateDispute":new Date(),
                        "descriptionDispute":req.body.descriptionDispute,
                        "idMotifDispute":req.body.idMotif,
                        "idUserDispute":idUser,
                        "statusDispute" : "NEW",
                        "contestDescriptionDispute": ""
                    }).then(function(result){
                        idDispute=result.idDispute;
                        
                        for(var i=0; i<req.body.idLigneOrder.length; i++ ){
                            
                            var request = {
                                "where": {
                                    idLigneOrderPaypalTransact: req.body.idLigneOrder[i]
                                }
                            };
                            var attributes = {};
                            attributes.statusPaypalTransact = "DISPUTES";

                            DisputeLigneOrder.create({
                                idLigneOrderDisputeLigneOrder : req.body.idLigneOrder[i],
                                idDisputeDisputeLigneOrder : idDispute,
                            });

                            //on mets toutes les transaction paypal en mode litige pour les bloquer le temps de la résolution du litige
                            PaypalTransact.update(attributes, request)
                            
                            //on envoi un mail au producteur
                            
                            sequelize.query("Select emailProducer FROM `producer`, ligneOrder WHERE ligneOrder.idProducerLigneOrder=producer.idProducer AND idLigneOrder = "+req.body.idLigneOrder[0], { type: sequelize.QueryTypes.SELECT  })
                            .then(function(result){
                                var mailProducer = utf8.decode(crpt.decryptAES(result[0].emailProducer))
                                var SendMailUtils = utils.SendMailUtils;
                                var myMail = new SendMailUtils();
                                var msg = "Bonjour,<br />Un litige a été ouvert pour la commande n°"+req.body.idOrder+"<br/>"
                                +"Vous pouvez accèder aux détails de ce litige en suivant le lien suivant : "+urlSite+"/producerDashboard/dispute/"+idDispute
                                +"<br /><br /><strong>Vous disposez d'une semaine pour répondre à ce litige ou un remboursement automatique auprès du client sera effectué.</strong>"
                                +"<br /><br />Cordialement,<br />L'équipe du Champ à la maison";

                                myMail.sendMail(mailProducer,"Ouverture d'un litige pour la commande n°"+req.body.idOrder, msg);
                            
                            })        
                        }
                        res.json({
                            "code" : 0,
                            "message" : "SignalOrder Create",
                            "result":null
                        });
                    }).catch(function(err){ 
                 //       console.log(err)
                        res.json({
                            "code" : 2,
                            "message" : "Sequelize error",
                            "result":null
                        });
                    });

                }
            }).catch(function(err){
               // console.log(err)
                res.json({
                    "code" : 2,
                    "message" : "Sequelize error",
                    "result":null
                });
            });

        }else{
            res.json({
                "code" : 1,
                "message" : "Missing required parameters",
                "result":null
            });
        }
    });


    app.post("/dispute/getDisputesFromProducer", function(req, res, next) {
        if(req.body.token && req.body.loginUser){
            var Producer = models.Producer
            var sequelize = models.sequelize; 
            var idProducer;
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {       
                if (TokenUtils.verifProducerToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result": null
                    });
                   
                } else {  
                    var request = {
                        attributes: ["idProducer"],
                        where: {
                            idUserProducer : result.idUser
                        },
                        
                    };
                    Producer.find(request).then(function(result){
                        if(result){
                            idProducer = result.idProducer;
                            sequelize.query("SELECT DISTINCT(idDispute), dateDispute, nameMotif, idOrderLigneOrder, statusDispute FROM dispute, disputeLigneOrder, ligneOrder, motif "
                            + "WHERE dispute.idDispute = disputeLigneOrder.idDisputeDisputeLigneOrder AND disputeLigneOrder.idLigneOrderDisputeLigneOrder = ligneOrder.idLigneOrder "
                            + "AND dispute.idMotifDispute = motif.idMotif AND idProducerLigneOrder = "+idProducer+" GROUP BY idDispute, idOrderLigneOrder, dateDispute, nameMotif, statusDispute ORDER BY dateDispute DESC", { type: sequelize.QueryTypes.SELECT  })
                            .then(function(result){
                                if(result && result.length>0){
                                    res.json({
                                        "code" : 0,
                                        "message" : null,
                                        "result":result
                                    });
                                }else{
                                    res.json({
                                        "code" : 1,
                                        "message" : "no dispute found",
                                        "result": null
                                    });
                                }
                            }).catch(function(err){
                                res.json({
                                    "code" : 2,
                                    "message" : "Sequelize error",
                                    "result":null
                                });
                            });
                        }else{
                            res.json({
                                "code" : 2,
                                "message" : "No producer found",
                                "result":null
                            });
                        }
                    }).catch(function(err){
                        res.json({
                            "code" : 2,
                            "message" : "Sequelize error",
                            "result":null
                        });
                    });;
                }
            }).catch(function(err){
                res.json({
                    "code" : 2,
                    "message" : "Sequelize error",
                    "result":null
                });
            });;
        }else{
            res.json({
                "code" : 1,
                "message" : "Missing required parameters",
                "result":null
            });
        }
    });

    app.post("/dispute/getDisputeDetailsFromProducer", function(req, res, next) {
        if(req.body.token && req.body.loginUser && req.body.idDispute){
            var Producer = models.Producer
            var sequelize = models.sequelize; 
            var utf8 = require('utf8');
            var CryptoUtils = utils.CryptoUtils;
            var crpt = new CryptoUtils();
            var idProducer;
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {       
                if (TokenUtils.verifProducerToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result": null
                    });
                   
                } else {  
                    var request = {
                        attributes: ["idProducer"],
                        where: {
                            idUserProducer : result.idUser
                        },
                        
                    };
                    Producer.find(request).then(function(result){
                        if(result){
                            idProducer = result.idProducer;
                            sequelize.query("SELECT idDispute, dateDispute, nameMotif, 	contestDescriptionDispute, idOrderLigneOrder, statusDispute, descriptionDispute, idLigneOrder, titleLigneOrder ,categoryLigneOrder, productLigneOrder, "
                            + " lastNameOrder, firstNameOrder, addressOrder, cpOrder, cityOrder, sexOrder FROM `order`, dispute, disputeLigneOrder, ligneOrder, motif "
                            + " WHERE dispute.idDispute = disputeLigneOrder.idDisputeDisputeLigneOrder AND disputeLigneOrder.idLigneOrderDisputeLigneOrder = ligneOrder.idLigneOrder "
                            + " AND dispute.idMotifDispute = motif.idMotif AND idProducerLigneOrder = "+idProducer+ " AND idDispute = "+req.body.idDispute+" AND `order`.idOrder = ligneOrder.idOrderLigneOrder "
                            + " GROUP BY idDispute, idOrderLigneOrder, dateDispute, nameMotif, statusDispute, idLigneOrder ORDER BY dateDispute DESC", { type: sequelize.QueryTypes.SELECT  })
                            .then(function(result){
                                if(result && result.length>0){
                                    for(var i =0; i<result.length; i++){
                                        result[i].lastNameOrder = utf8.decode(crpt.decryptAES(result[i].lastNameOrder));
                                        result[i].firstNameOrder = utf8.decode(crpt.decryptAES(result[i].firstNameOrder));
                                        result[i].sexOrder = utf8.decode(crpt.decryptAES(result[i].sexOrder));
                                        result[i].addressOrder = utf8.decode(crpt.decryptAES(result[i].addressOrder));
                                        result[i].cityOrder = utf8.decode(crpt.decryptAES(result[i].cityOrder));
                                        result[i].cpOrder = utf8.decode(crpt.decryptAES(result[i].cpOrder));
                                    }
                                    res.json({
                                        "code" : 0,
                                        "message" : null,
                                        "result":result
                                    });
                                }else{
                                    res.json({
                                        "code" : 1,
                                        "message" : "no dispute found",
                                        "result": null
                                    });
                                }
                            }).catch(function(err){
                                res.json({
                                    "code" : 2,
                                    "message" : "Sequelize error",
                                    "result":null
                                });
                            });
                        }else{
                            res.json({
                                "code" : 2,
                                "message" : "No producer found",
                                "result":null
                            });
                        }
                    }).catch(function(err){
                        res.json({
                            "code" : 2,
                            "message" : "Sequelize error",
                            "result":null
                        });
                    });;
                }
            }).catch(function(err){
                res.json({
                    "code" : 2,
                    "message" : "Sequelize error",
                    "result":null
                });
            });;
        }else{
            
            res.json({
                "code" : 1,
                "message" : "Missing required parameters",
                "result":null
            });
        }
    });

    app.post("/dispute/saveStatus", function(req, res, next) { 
        if(req.body.token && req.body.loginUser && req.body.idDispute && req.body.statusDispute ){ 

            var Producer = models.Producer
            var Dispute = models.Dispute;
            var PaypalTransact = models.PaypalTransact;
            var sequelize = models.sequelize; 
            var idProducer;
            var mailProducer;
            var ligneRefund;
            var utf8 = require('utf8');
            var CryptoUtils = utils.CryptoUtils;
            var crpt = new CryptoUtils();

            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {       
                if (TokenUtils.verifProducerToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result": null
                    });
                } else {  
                    var requestp = {
                        attributes: ["idProducer"],
                        where: {
                            idUserProducer : result.idUser
                        },
                        
                    };
                    Producer.find(requestp).then(function(result){
                        if(result){
                            idProducer = result.idProducer;
                            sequelize.query("SELECT idDispute, idLigneOrderDisputeLigneOrder, emailUser FROM user, dispute, disputeLigneOrder, ligneOrder "
                            + "WHERE dispute.idDispute = disputeLigneOrder.idDisputeDisputeLigneOrder AND user.idUser = dispute.idUserDispute AND idProducerLigneOrder = "+idProducer+" AND idDispute = "+req.body.idDispute, { type: sequelize.QueryTypes.SELECT  })
                            .then(function(result){

                                if(result && result.length>0){
                                    ligneRefund = result;
                                    var attributes = {};
                                    attributes.statusDispute = req.body.statusDispute;
                                    if(req.body.statusDispute == "CONTESTED"){
                                        attributes.contestDescriptionDispute = req.body.contestDescriptionDispute;
                                    }
                                    var request = {
                                        where: {
                                            idDispute : req.body.idDispute
                                        },
                                    }
        
                                    Dispute.update(attributes, request).then(function (results) {
                                        var SendMailUtils = utils.SendMailUtils;
                                        var myMail = new SendMailUtils();
                                        var emailUser = utf8.decode(crpt.decryptAES(ligneRefund[0].emailUser));
                                        if(req.body.statusDispute == "ACCEPTED"){
                                            for(var i =0; i<ligneRefund.length; i++){
                                                var attributes2 = {};
                                                attributes2.statusPaypalTransact = "REFUND"
                                                var request2 = {
                                                    where: {
                                                        idLigneOrderPaypalTransact : ligneRefund[i].idLigneOrderDisputeLigneOrder
                                                    },
                                                }
                                                PaypalTransact.update(attributes2, request2).then(function (results) {});
                                            }
                                            
                                            var messageUser ="Bonjour,<br /><br/>Votre litige n°"+req.body.idDispute+" viens d'être traité par le vendeur et à accepté la demande de remboursement. Le remboursement sera effectif d'ici 24h.<br/><br />Cordialement, l'équipe du champ à la maison.";
                                            myMail.sendMail(emailUser,"Mise a jour d'un litige.", messageUser);

                                        }else{
                                            var messageUser ="Bonjour,<br /><br/>Votre litige n°"+req.body.idDispute+" viens d'être traité par le vendeur à contesté ce litige.<br/></br>Motif : "+req.body.contestDescriptionDispute+"<br/><br/>Notre équipe va faire en sorte de traité et arbitré ce litige et vous serez informer du résultat au plus vite.(7 jours de traitement maximum). <br/><br />Cordialement, l'équipe du champ à la maison.";
                                            myMail.sendMail(emailUser,"Mise a jour d'un litige.", messageUser);
                                            myMail.sendMail("lechampalamaison@gmail.com","Demande d'arbitrage", "Nouvelle demande d'arbitrage, merci de vous rendre sur l'espace dédié à son traitement.");
                                        }
                                        res.json({
                                            "code":0,
                                            "message":"Status Dispute updated",
                                            "result": null
                                        });
                                    }).catch(function (err) {
                                        console.log(err)
                                        res.json({
                                            "code": 2,
                                            "message": "Sequelize error",
                                            "result": null
                                        });
                                    });

                                }else{
                                    res.json({
                                        "code" : 6,
                                        "message" : "Failed to authenticate",
                                        "result": null
                                    });
                                }
                            })

                           
                            
                        }else{
                            res.json({
                                "code" : 6,
                                "message" : "Failed to authenticate",
                                "result": null
                            });
                        }


                    }).catch(function(err){
                        
                        res.json({
                            "code" : 2,
                            "message" : "Sequelize error",
                            "result":null
                        });
                    });;

                }
            }).catch(function(err){
                
                res.json({
                    "code" : 2,
                    "message" : "Sequelize error",
                    "result":null
                });
            });;
        }else{
            res.json({
                "code" : 1,
                "message" : "Missing required parameters",
                "result":null
            });
        }
    });


    
    app.post("/dispute/getDisputesFromUser", function(req, res, next) {
        if(req.body.token && req.body.loginUser){
            var Producer = models.Producer
            var sequelize = models.sequelize; 
            var idUser;
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {     
                idUser = result.idUser;
                if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result": null
                    });
                   
                } else {         
                    sequelize.query("SELECT DISTINCT(idDispute), dateDispute, nameMotif, idOrderLigneOrder, statusDispute FROM dispute, disputeLigneOrder, ligneOrder, motif "
                    + "WHERE dispute.idDispute = disputeLigneOrder.idDisputeDisputeLigneOrder AND disputeLigneOrder.idLigneOrderDisputeLigneOrder = ligneOrder.idLigneOrder "
                    + "AND dispute.idMotifDispute = motif.idMotif AND idUserDispute = "+idUser+" GROUP BY idDispute, idOrderLigneOrder, dateDispute, nameMotif, statusDispute ORDER BY dateDispute DESC", { type: sequelize.QueryTypes.SELECT  })
                    .then(function(result){
                        if(result && result.length>0){
                            res.json({
                                "code" : 0,
                                "message" : null,
                                "result":result
                            });
                        }else{
                            res.json({
                                "code" : 1,
                                "message" : "no dispute found",
                                "result": null
                            });
                        }
                    }).catch(function(err){
                        res.json({
                            "code" : 2,
                            "message" : "Sequelize error",
                            "result":null
                        });
                    });
                       
                }
            }).catch(function(err){
                res.json({
                    "code" : 2,
                    "message" : "Sequelize error",
                    "result":null
                });
            });;
        }else{
            res.json({
                "code" : 1,
                "message" : "Missing required parameters",
                "result":null
            });
        }
    });


    app.post("/dispute/getDisputeDetailsFromUser", function(req, res, next) {
        if(req.body.token && req.body.loginUser && req.body.idDispute){
            var Producer = models.Producer
            var sequelize = models.sequelize; 
            var utf8 = require('utf8');
            var CryptoUtils = utils.CryptoUtils;
            var crpt = new CryptoUtils();
            var idUser;
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {       
                idUser = result.idUser;
                if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result": null
                    });
                   
                } else {  
                   
                    sequelize.query("SELECT idDispute, dateDispute, nameMotif, 	contestDescriptionDispute, loginUser, idProducer, idOrderLigneOrder, statusDispute, descriptionDispute, idLigneOrder, titleLigneOrder ,categoryLigneOrder, productLigneOrder "
                    + "  FROM `order`, dispute, disputeLigneOrder, ligneOrder, motif, producer, user "
                    + " WHERE dispute.idDispute = disputeLigneOrder.idDisputeDisputeLigneOrder AND disputeLigneOrder.idLigneOrderDisputeLigneOrder = ligneOrder.idLigneOrder "
                    + " AND dispute.idMotifDispute = motif.idMotif AND idUserDispute = "+idUser+ " AND idDispute = "+req.body.idDispute+" AND `order`.idOrder = ligneOrder.idOrderLigneOrder AND ligneOrder.idProducerLigneOrder = producer.idProducer AND producer.idUserProducer = user.idUser"
                    + " GROUP BY idDispute, idOrderLigneOrder, dateDispute, nameMotif, statusDispute, idLigneOrder ORDER BY dateDispute DESC", { type: sequelize.QueryTypes.SELECT  })
                    .then(function(result){
                        if(result && result.length>0){
                            res.json({
                                "code" : 0,
                                "message" : null,
                                "result":result
                            });
                        }else{
                            res.json({
                                "code" : 1,
                                "message" : "no dispute found",
                                "result": null
                            });
                        }
                    }).catch(function(err){
                        res.json({
                            "code" : 2,
                            "message" : "Sequelize error",
                            "result":null
                        });
                    });
                        
                }
            }).catch(function(err){
                res.json({
                    "code" : 2,
                    "message" : "Sequelize error",
                    "result":null
                });
            });;
        }else{
            
            res.json({
                "code" : 1,
                "message" : "Missing required parameters",
                "result":null
            });
        }
    });
    

      
    app.post("/dispute/getDisputesFromAdmin", function(req, res, next) {
        if(req.body.token && req.body.loginUser){
            var Producer = models.Producer
            var sequelize = models.sequelize; 
           
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {     
                if (TokenUtils.verifAdminToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result": null
                    });
                   
                } else {         
                    sequelize.query("SELECT DISTINCT(idDispute), dateDispute, nameMotif, idOrderLigneOrder, statusDispute FROM dispute, disputeLigneOrder, ligneOrder, motif "
                    + "WHERE dispute.idDispute = disputeLigneOrder.idDisputeDisputeLigneOrder AND disputeLigneOrder.idLigneOrderDisputeLigneOrder = ligneOrder.idLigneOrder "
                    + "AND dispute.idMotifDispute = motif.idMotif GROUP BY idDispute, idOrderLigneOrder, dateDispute, nameMotif, statusDispute ORDER BY dispute.updatedAt DESC", { type: sequelize.QueryTypes.SELECT  })
                    .then(function(result){
                        if(result && result.length>0){
                            res.json({
                                "code" : 0,
                                "message" : null,
                                "result":result
                            });
                        }else{
                            res.json({
                                "code" : 1,
                                "message" : "no dispute found",
                                "result": null
                            });
                        }
                    }).catch(function(err){
                        res.json({
                            "code" : 2,
                            "message" : "Sequelize error",
                            "result":null
                        });
                    });
                       
                }
            }).catch(function(err){
                res.json({
                    "code" : 2,
                    "message" : "Sequelize error",
                    "result":null
                });
            });;
        }else{
            res.json({
                "code" : 1,
                "message" : "Missing required parameters",
                "result":null
            });
        }
    });


    app.post("/dispute/getDisputeDetailsFromAdmin", function(req, res, next) {
        if(req.body.token && req.body.loginUser && req.body.idDispute){
            var Producer = models.Producer
            var sequelize = models.sequelize; 
            var utf8 = require('utf8');
            var CryptoUtils = utils.CryptoUtils;
            var crpt = new CryptoUtils();
           
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {       
                if (TokenUtils.verifAdminToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result": null
                    });
                   
                } else {  
                   
                    sequelize.query("SELECT idDispute, dateDispute, nameMotif, 	contestDescriptionDispute, loginUser, idProducer, idOrderLigneOrder, statusDispute, descriptionDispute, idLigneOrder, titleLigneOrder ,categoryLigneOrder, productLigneOrder "
                    + "  ,lastNameOrder, firstNameOrder, addressOrder, cpOrder, cityOrder, sexOrder FROM `order`, dispute, disputeLigneOrder, ligneOrder, motif, producer, user "
                    + " WHERE dispute.idDispute = disputeLigneOrder.idDisputeDisputeLigneOrder AND disputeLigneOrder.idLigneOrderDisputeLigneOrder = ligneOrder.idLigneOrder "
                    + " AND dispute.idMotifDispute = motif.idMotif AND `order`.idOrder = ligneOrder.idOrderLigneOrder AND ligneOrder.idProducerLigneOrder = producer.idProducer AND producer.idUserProducer = user.idUser"
                    + " AND idDispute = "+req.body.idDispute+" GROUP BY idDispute, idOrderLigneOrder, dateDispute, nameMotif, statusDispute, idLigneOrder ORDER BY dateDispute DESC", { type: sequelize.QueryTypes.SELECT  })
                    .then(function(result){
                        if(result && result.length>0){
                            for(var i =0; i<result.length; i++){
                                result[i].lastNameOrder = utf8.decode(crpt.decryptAES(result[i].lastNameOrder));
                                result[i].firstNameOrder = utf8.decode(crpt.decryptAES(result[i].firstNameOrder));
                                result[i].sexOrder = utf8.decode(crpt.decryptAES(result[i].sexOrder));
                                result[i].addressOrder = utf8.decode(crpt.decryptAES(result[i].addressOrder));
                                result[i].cityOrder = utf8.decode(crpt.decryptAES(result[i].cityOrder));
                                result[i].cpOrder = utf8.decode(crpt.decryptAES(result[i].cpOrder));
                            }
                            res.json({
                                "code" : 0,
                                "message" : null,
                                "result":result
                            });
                        }else{
                            res.json({
                                "code" : 1,
                                "message" : "no dispute found",
                                "result": null
                            });
                        }
                    }).catch(function(err){
                        res.json({
                            "code" : 2,
                            "message" : "Sequelize error",
                            "result":null
                        });
                    });
                        
                }
            }).catch(function(err){
                res.json({
                    "code" : 2,
                    "message" : "Sequelize error",
                    "result":null
                });
            });;
        }else{
            
            res.json({
                "code" : 1,
                "message" : "Missing required parameters",
                "result":null
            });
        }
    });
    

    app.post("/dispute/arbitrage", function(req, res, next) { 
        if(req.body.token && req.body.loginUser && req.body.idDispute && req.body.winner && req.body.description){ 

            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {     
                if (TokenUtils.verifAdminToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token",
                        "result": null
                    });
                } else {    
                    var Dispute = models.Dispute;
                    var attributes = {}
                    attributes.winnerContestDispute = req.body.winner;
                    attributes.winnerContestDescriptionDispute = req.body.description;
                    attributes.statusDispute = "CLOSE";
                    var sequelize = models.sequelize;

                    var request = {
                        where: {
                            idDispute : req.body.idDispute
                        }
                    }

                    Dispute.update(attributes, request).then(function (results) {});

                    //On recup les infos pour eviter de refaire un paiement si le producteur a déjà été payé
                    sequelize.query("SELECT idPaypalTransact, dateRediPaypalTransact, statusPaypalTransact FROM dispute, disputeLigneOrder, ligneOrder, paypalTransact "
                    +" WHERE dispute.idDispute = disputeLigneOrder.idDisputeDisputeLigneOrder AND disputeLigneOrder.idLigneOrderDisputeLigneOrder = ligneOrder.idLigneOrder "
                    +" AND ligneOrder.idLigneOrder = paypalTransact.idLigneOrderPaypalTransact AND idDispute = "+req.body.idDispute,  { type: sequelize.QueryTypes.SELECT  })
                    .then(function(result){
                        if(result && result.length>0){

                            for (var i =0; i<result.length; i++){
                                var newState = "";
                                if(req.body.winner =="PRODUCER"){
                                    if(result[i].dateRediPaypalTransact == null){
                                        newState ="TO DO";
                                    }else{
                                        newState ="SUCCESS";
                                    }
                                }else{
                                    if(result[i].dateRediPaypalTransact == null){
                                        newState ="REFUND";
                                    }
                                }
                                
                                var request2 = {
                                    where: {
                                        idPaypalTransact : result[i].idPaypalTransact
                                    },
                                }
                                var attributes2 = {};
                                attributes2.statusPaypalTransact = newState;
                                var PaypalTransact = models.PaypalTransact;

                                PaypalTransact.update(attributes2, request2);
                            }
                            res.json({
                                "code" : 0,
                                "message" : "",
                                "result":null
                            });

                        }else{
                            res.json({
                                "code" : 3,
                                "message" : "No transact found",
                                "result":null
                            });
                        }
                    }).catch(function(err){
                        res.json({
                            "code" : 2,
                            "message" : "Sequelize error",
                            "result":null
                        });
                    }) 
                }
            })

        }else{
            res.json({
                "code" : 1,
                "message" : "Missing required parameters",
                "result":null
            });
        }
    });

}