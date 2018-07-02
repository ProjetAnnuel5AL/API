module.exports = function(app, models, TokenUtils, utils, urlApi, urlSite) {

    app.post("/signalOrder", function(req, res, next) { 
        if(req.body.token && req.body.loginUser && req.body.idMotif && req.body.idLigneOrder && req.body.descriptionSignalOrder && req.body.idOrder){
            var SignalOrder = models.SignalOrder;
            var SignalOrderLigneOrder = models.SignalOrderLigneOrder;
            var PaypalTransact = models.PaypalTransact;
            var idUser;
            var idSignalOrder;
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