var request = require("supertest-session");
var api=require("../index.js");
var models = require("../models");
var utils = require("../utils");
var utf8 = require('utf8');
var CryptoUtils = utils.CryptoUtils;
var crpt = new CryptoUtils();

describe("user",function(){
   
    before(function () {
        var sequelize = models.sequelize;
        sequelize.query('TRUNCATE TABLE user');
    });

    afterEach(function () {
        //console.log('afterEach run!');
    });


    describe("POST /user",function(){
        it("should generate user", function(done){
            var data={idUser : 1 ,loginUser: "test",emailUser:"test@test.com",passwordUser: "test123"};
            request(api).post("/user")
                .type("form")
                .send(data)
                .expect(200)
                .expect({"code" : 0, "message" : null, "result" : {"loginUser" : "test"}})
                .end(function(err,res){
                if(err) {
                    done(err);
                }else{
                    done();
                }
            });
        });

        it("Login already used", function(done){
            var data={idUser : 1 ,loginUser: "test",emailUser:"test@test.com",passwordUser: "test123"};
            request(api).post("/user")
                .type("form")
                .send(data)
                .expect(200)
                .expect({"code" : 4, "message" : "login already used", "result" : null })
                .end(function(err,res){
                if(err) {
                    done(err);
                }else{
                    done();
                }
            });
        });

        it("Email already used ", function(done){
            var data={idUser : 1 ,loginUser: "test2",emailUser:"test@test.com",passwordUser: "test123"};
            request(api).post("/user")
                .type("form")
                .send(data)
                .expect(200)
                .expect({"code" : 5, "message" : "email already used", "result" : null })
                .end(function(err,res){
                if(err) {
                    done(err);
                }else{
                    done();
                }
            });
        });

        it("Missing required parameters ", function(done){
            var data={idUser : 1, emailUser:"test@test.com",passwordUser: "test123"};
            request(api).post("/user")
                .type("form")
                .send(data)
                .expect(200)
                .expect({
                    "code" : 1,
                    "message" : "Missing required parameters",
                    "result":null
                })
                .end(function(err,res){
                if(err) {
                    done(err);
                }else{
                    done();
                }
            });
        });

        it("Sequelize Error ", function(done){
            var data={idUser: "ttt", loginUser: "test3", emailUser:"test3@test.com", passwordUser:"test123"};
            request(api).post("/user")
                .type("form")
                .send(data)
                .expect(200)
                .expect({
                    "code" : 2,
                    "message" : "Sequelize error",
                    "result":null
                })
                .end(function(err,res){
                if(err) {
                    done(err);
                }else{
                    done();
                }
            });
        });
 
    });



    describe("GET /user/findForValidation",function(){

        it("Missing required parameters", function(done){
            var data={validationCodeUser : null};
            request(api).get("/user/findForValidation")
                .type("form")
                .send(data)
                .expect(200)
                .expect({
                    "code" : 1,
                    "message" : "Missing required parameters",
                    "result":null
                })
                .end(function(err,res){
                if(err) {
                    done(err);
                }else{
                    done();
                }
            });
        });

        it("User not found", function(done){
            var data={validationCodeUser : "1"};
            request(api).get("/user/findForValidation")
                .type("form")
                .send(data)
                .expect(200)
                .expect({
                    "code" : 3,
                    "message" : "User not found",
                    "result":null
                })
                .end(function(err,res){
                if(err) {
                    done(err);
                }else{
                    done();
                }
            });
        });

    });
	
});