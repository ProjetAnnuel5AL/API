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

module.exports={
    "CheckEmailUser" : CheckEmailUser,
};