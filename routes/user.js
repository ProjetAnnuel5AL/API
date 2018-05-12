var bcrypt = require("bcrypt-nodejs");

// Code : 
// 0 : OK
// 1 : missing params
// 2 : sequelize error
// 3 : not found, wrong pwd, ...
// 4 : Unauthorized

module.exports = function(app, models) {

	//CREATE USER
    app.post("/user", function(req, res, next) {
        if (req.body.loginUser
            && req.body.emailUser && req.body.passwordUser) {

            var User = models.User;
            User.create({
                "loginUser" : req.body.loginUser,
                "emailUser" : req.body.emailUser,
                "passwordUser" : bcrypt.hashSync(req.body.passwordUser, null, null),
                "typeUser" : "user"
            }).then(function(result){
                res.json({
                    "code" : 0,
                    "loginUser" : result.loginUser,
                    "emailUser" : result.emailUser
                });
            }).catch(function(err){
                res.json({
                    "code" : 2,
                    "message" : "Sequelize error",
                    "error" : err
                });
            });
        } else {
            res.json({
                "code" : 1,
                "message" : "Missing required parameters"
            });
        }
    });

	// a refaire
	//GET ALL USER
    app.get("/users", function(req, res, next) {
        
        var User = models.User;
        var request = {
            attributes: ["loginUser", "emailUser", "typeUser"],  
        };
        User.findAll(request).then(function(result){
            if(result){
                res.json(result);
            }else{
                res.json({
                    "code" : 3,
                    "message" : "User not found"
                });
            }
        });
    
    });

	//GET USER BY ID
    app.get("/user/:idUser", function(req, res, next) {
        if (req.params.idUser){
            var User = models.User;
            var request = {
                where: {
                    idUser : req.params.idUser
                }
            };
            User.find(request).then(function(result) {
                if (result){
                    res.json({
                        "code" : 0,
                        "loginUser" : result.loginUser
                    });
                } else {
                    res.json({
                        "code" : 3,
                        "message" : "User not found"
                    });
                }
            });
        } else {
            res.json({
                "code" : 1,
                "message" : "Missing required parameters"
            });
        }
    });

	//AUTH
    app.get("/user/auth", function(req, res, next) {
        if (req.body.loginUser && req.body.passwordUser) {
            var User = models.User;
            var request = {
                attributes: ["idUser", "loginUser", "passwordUser", "emailUser", "typeUser"],
                where: {
                    loginUser : req.body.loginUser
                }
            };
            User.find(request).then(function(result){
                if(result){
                    if(bcrypt.compareSync(req.body.passwordUser, result.passwordUser)){
                        res.json({
                            "code" : 0,
                            "idUser" : result.idUser,
                            "loginUser" : result.loginUser,
                            "emailUser" : result.emailUser,
                            "typeUser" : result.typeUser
                        });
                    }else{
                        res.json({
                            "code" : 3,
                            "message" : "Wrong pwd"
                        });
                    }
                }else{
                    res.json({
                        "code" : 3,
                        "message" : "User not found"
                    });
                }
            }).catch(function(err){
                res.json({
                    "code" : 2,
                    "message" : "Sequelize error",
                    "error" : err
                });
            });
        } else {
            res.json({
                "code" : 1,
                "message" : "Missing required parameters"
            });
        }
    });
	
    app.delete("/deleteuser/:id", function (req, res, next) {  
        var u1 = new user();
        if (req.params.id) {
            u1.delete(req.params.id, function (result) {
                res.status(200);
                res.json({
                    "user":"deleted"
                });
            });
        }
    });
}
