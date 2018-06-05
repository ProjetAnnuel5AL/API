var request = require("supertest-session");
var api=require("../index.js");
var models = require("../models");


describe("user",function(){
   
    before(function () {
        var sequelize = models.sequelize;
        sequelize.query('TRUNCATE TABLE user');
    });

    afterEach(function () {
        console.log('afterEach run!');
    });


    describe("POST /user",function(){
        it("should generate user", function(done){
            var data={idUser : 1 ,loginUser: "test",emailUser:"test@test.com",passwordUser: "test123"};
            request(api).post("/user").type("form").send(data).expect(200).expect({"code":"0","loginUser":"test","emailUser":"test@test.com"}).end(function(err,res){
                if(err) {
                    done(err);
                }else{
                    done();
                }
            });
        });
    });

    describe("GET /user/find", function(){
        it("should return a user", function(){
            var data={loginUser: "test"};
            return request(api).get("/user/find").send(data).expect(200).expect({"code":"0","emailUser":"test@test.com","loginUser":"test","typeUser":"user"});
        });
    });

    describe("GET /users",function(){
        it("should  display a list of user", function(){
            return request(api).get("/users").expect(200);
        });
    });

    describe("DELETE /deleteUser/1",function(){
        it("should  deleteUser", function(){
            return request(api).delete("/deleteUser/1").expect(200).expect({"code":"0", "message":"user deleted"});
        });
    });
	
});
