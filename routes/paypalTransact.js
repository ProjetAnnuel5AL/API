require("../env.js");
module.exports = function (app, models, TokenUtils, utils) {

    app.get("/paypalTransct/redistribute", function (req, res, next) {
        
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
                            "value": /*crpt.decryptAES(*/result[i].valuePaypalTransact/*)*/,
                            "currency": "EUR"
                        },
                        "note": "",
                        "sender_item_id": /*crpt.decryptAES(*/result[i].itemIdPaypalTransact/*)*/,
                        "receiver": crpt.decryptAES(result[i].paypalProducer),
                    }
                    items.push(item);
                }

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
                    "message" : "No Pending transaction found" 
                })
            }
        })

    });

}