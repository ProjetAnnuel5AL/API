module.exports = function (app, models, TokenUtils, utils) {

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
                                                "idProducerOrder": result.idProducer,
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
                                "message": "Order saved"
                            })

                        }else{
                            res.json({
                                "code" : 2,
                                "message": "Payment not approuved"
                            })
                        }
                    }else{
                        res.json({
                            "code" : 2,
                            "message": "No Payment found"
                        })
                    }
                })
            })   
        }else{
            res.json({
                "code" : 1,
                "message" : "Missing required parameters"
            });
        }
    })

    
    app.get("/order/user", function (req, res, next) { 
        if(req.body.loginUser && req.body.token){
            var orders;
            var status = [];
            var FinderUtils = utils.FinderUtils;
            TokenUtils.findIdUser(req.body.loginUser).then( function(result) {       
                if (TokenUtils.verifSimpleToken(req.body.token, "kukjhifksd489745dsf87d79+62dsfAD_-=", result.idUser) == false) {
                    res.json({
                        "code" : 6,
                        "message" : "Failed to authenticate token"
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
                                            "orders" : orders,
                                            "status" : status,
                                        });
                                   }
                                })
                               
                            }
                            
                           
                        }else{
                            res.json({
                                "code": 1,
                                "message": "No Order",
                                "orders" : null
                            });
                        }
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

};