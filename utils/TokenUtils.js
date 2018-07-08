var models=require("../models");
var jwt = require('jsonwebtoken');

//UserType: 0
//ProducerType: 1
//AdminType: 2
var secret = "kukjhifksd489745dsf87d79+62dsfAD_-=";

var findIdUser = function(login) {
    var request = {
        where: {
            loginUser : login
        }
    };
    var User = models.User;
    return User.find(request).then(function(result) {
        if (result){ 
            return result.dataValues;     
        }else{        
            return null;
        }
    });
};

var getIdAndType = function(token){
    return jwt.verify(token, secret, function(err, decoded) {
        if (err) {
            return false;
        }else{
            return {id: decoded.id, type: decoded.admin};
        }
    });
};


var verifSimpleToken = function(token, secret, idUser){
    return jwt.verify(token,secret, function(err, decoded) {
        if (err) {
            return false;
        }else{
            if(!idUser || idUser!=decoded.id){
                return false;
             }else{
                 return true;
             }
        }
    });      
};


var verifUserOrderToken = function(token, secret, idUser, idOrder){
    var Order = models.Order;
    var request = {
        where: {
            idUserOrder : idUser,
            idOrder : idOrder
        }, 
    };
    return jwt.verify(token,secret, function(err, decoded) {
        if (err) {
            return false;
        }else{
            if(!idUser || idUser!=decoded.id){
                return false;
             }else{
                return Order.find(request).then(function(result){
                    if(result){
                        return true;
                    }else{
                        return false;
                    }
                }).catch(function(err){
                    return false;
                });
             }
        }
    });      
};


var verifProducerToken = function(token, secret, idUser){
    return jwt.verify(token,secret, function(err, decoded) {
        if (err) {
            return false;
        }else{
            if(!idUser || idUser!=decoded.id){
                return false;
             }else{
                 if(decoded.admin == 1){
                    return true;
                 }else{
                    return false;
                 }
             }
        }
    });      
};

var verifAdminToken = function(token, secret, idUser){
    return jwt.verify(token, secret, function(err, decoded) {
        if (err) {
            return false;
        }else{
            if(!idUser || idUser!=decoded.id){
                return false;
             }else{
                 if(decoded.admin == 2){
                    return true;
                 }else{
                    return false;
                 }
             }
        }
    });      
};


module.exports={
    "findIdUser" : findIdUser,
    "getIdAndType": getIdAndType,
    "verifSimpleToken" : verifSimpleToken,
    "verifProducerToken": verifProducerToken,
    "verifAdminToken": verifAdminToken,
    "verifUserOrderToken" : verifUserOrderToken
};