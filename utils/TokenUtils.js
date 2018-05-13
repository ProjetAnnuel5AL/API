var models=require("../models");
var jwt = require('jsonwebtoken');




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


module.exports={
    "findIdUser" : findIdUser,
    "verifSimpleToken" : verifSimpleToken
    };