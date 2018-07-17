var request = require("supertest-session");
var api=require("../index.js");
var models = require("../models");
var utils = require("../utils");
var utf8 = require('utf8');
var CryptoUtils = utils.CryptoUtils;
var crpt = new CryptoUtils();

describe("Dispute", function(){
   
    before(function () {
        var sequelize = models.sequelize;
        sequelize.query('TRUNCATE TABLE dispute');

    });

    afterEach(function () {
        //console.log('afterEach run!');
    });

    describe("POST /dispute",function(){
        var data={token : 1 ,loginUser: "test",idLigneOrder :"test@test.com", descriptionDispute : "test123"};
        it("missing params", function(done){
            request(api).post("/dispute")
                .type("form")
                .send(data)
                .expect(200)
                .expect({ "code" : 1, "message" : "Missing required parameters", "result":null})
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