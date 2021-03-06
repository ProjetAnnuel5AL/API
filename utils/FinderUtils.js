var models = require("../models");
var CryptoUtils = require("./CryptoUtils");

var CheckEmailUser = function(email) {
    var requestVerifyEmail = {
        attributes: ["emailUser"]
    };
    
    var crpt = new CryptoUtils();
    var User = models.User;
    return User.findAll(requestVerifyEmail).then(function(result) {  
        if (result){ 
            return result.find(function(element){
                return crpt.decryptAES(element.emailUser) == email;
            });     
        }else{        
            return null;
        }

    }).catch(function(err){
        
        return null;
    });
};

var FindProducerIdWithCart = function(cart){
    var sequelize = models.sequelize;
    return sequelize.query("SELECT idProducer FROM producer, item, user WHERE item.idUserItem = user.idUser AND user.idUser = producer.idUserProducer AND item.idItem = "+cart.id,  { type: sequelize.QueryTypes.SELECT  }).then(function (result) {
        if(result && result.length>0){
            result[0].cart = cart;
            return result[0];
        }else{
            return null;
        }
    }).catch(function(err){
        //console.log(err)
        return null;
    });
}
 
var FindStatusOrder = function(order, i){
    var sequelize = models.sequelize;
    return sequelize.query("SELECT DISTINCT(statusPaypalTransact) FROM paypalTransact, ligneOrder WHERE ligneOrder.idLigneOrder = paypalTransact.idLigneOrderPaypalTransact AND idOrderLigneOrder ="+order.idOrder, { type: sequelize.QueryTypes.SELECT  }).then(function (results) { 
        if(results.length>0){    
            if(results.map(function(e) { return e.statusPaypalTransact; }).indexOf('DISPUTES') != -1){
                return { "i": i, "statusOrder" :"Litige en cours" }
            }else if(results.map(function(e) { return e.statusPaypalTransact; }).indexOf('PENDING') != -1){
                return { "i": i, "statusOrder" :"En attente de reception" }
            }else{
                return { "i": i, "statusOrder" :"Terminé" }
            }
        }else{
            return { "i": i, "statusOrder" :"Terminé" }
        }
        
    }).catch(function(err){
        return { "i": i};
    });
}


var FindStatusOrderProducer = function(order, i){
    var sequelize = models.sequelize;
    return sequelize.query("SELECT DISTINCT(statusPaypalTransact) FROM paypalTransact, ligneOrder WHERE ligneOrder.idLigneOrder = paypalTransact.idLigneOrderPaypalTransact AND idOrderLigneOrder ="+order.idOrder+" AND statusPaypalTransact=\"PENDING\"", { type: sequelize.QueryTypes.SELECT  }).then(function (results) { 
        if(results.map(function(e) { return e.statusPaypalTransact; }).indexOf('DISPUTES') != -1){
            return { "i": i, "statusOrder" :"Litige en cours" }
        }else if(results.map(function(e) { return e.statusPaypalTransact; }).indexOf('PENDING') != -1){
            return { "i": i, "statusOrder" :"En attente de reception client" }
        }else{
            return { "i": i, "statusOrder" :"Terminé" }
        }
    }).catch(function(err){
        return { "i": i};
    });
}

module.exports={
    "CheckEmailUser" : CheckEmailUser,
    "FindProducerIdWithCart" : FindProducerIdWithCart,
    "FindStatusOrder" : FindStatusOrder,
    "FindStatusOrderProducer" : FindStatusOrderProducer
};