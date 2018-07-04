module.exports = function(app, models, TokenUtils, utils, urlApi, urlSite) {

    var utf8 = require('utf8');

    app.post("/signalOrder", function(req, res, next) { 
        if(req.body.token && req.body.loginUser && req.body.idMotif && req.body.idLigneOrder && req.body.descriptionSignalOrder && req.body.idOrder){
            var SignalOrder = models.SignalOrder;
            var SignalOrderLigneOrder = models.SignalOrderLigneOrder;
            var PaypalTransact = models.PaypalTransact;
            var idUser;
            var idSignalOrder;
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
                    SignalOrder.create({
                        "dateSignalOrder":new Date(),
                        "descriptionSignalOrder":req.body.descriptionSignalOrder,
                        "idMotifSignalOrder":req.body.idMotif,
                        "idUserSignalOrder":idUser,
                    }).then(function(result){
                        idSignalOrder=result.idSignalOrder;
                        
                        for(var i=0; i<req.body.idLigneOrder.length; i++ ){
                            
                            var request = {
                                "where": {
                                    idLigneOrderPaypalTransact: req.body.idLigneOrder[i]
                                }
                            };
                            var attributes = {};
                            attributes.statusPaypalTransact = "DISPUTES";

                            SignalOrderLigneOrder.create({
                                idLigneOrderSignalOrderLigneOrder : req.body.idLigneOrder[i],
                                idSignalOrderSignalOrderLigneOrder : idSignalOrder,
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
                                +"Vous pouvez accèder aux détails de ce litige en suivant le lien suivant : "+urlSite+"/signalOrderProducer/"+idSignalOrder
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
            });

        }else{
            res.json({
                "code" : 1,
                "message" : "Missing required parameters",
                "result":null
            });
        }
    });

}