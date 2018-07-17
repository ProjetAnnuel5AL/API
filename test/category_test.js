var request = require("supertest-session");
var api=require("../index.js");
var models = require("../models");
var utils = require("../utils");
var utf8 = require('utf8');
var CryptoUtils = utils.CryptoUtils;
var crpt = new CryptoUtils();

describe("category", function(){
   
    before(function () {
        
        var Category = models.Category;
        return Category.create({
            idCategory : 1,
            nameCategory : "Légume"
        }, {
            idCategory : 2,
            nameCategory : "Fruit"
        })
    
    });

    afterEach(function () {
        var sequelize = models.sequelize;
        sequelize.query('TRUNCATE TABLE category');
    });

    /*describe("GET /category",function(){

        it("should find 2 cat order by name", function(done){
            request(api).get("/categories")
                .type("form")
                .send()
                .expect(200)
                .expect({"code" : 0, "message" : null, "result" : [
                    {"idCategory" : 2, "nameCategory": "Fruit"},
                    {"idCategory" : 1, "nameCategory": "Légume"}
                ]})
                .end(function(err,res){
                if(err) {
                    done(err);
                }else{
                    done();
                }
            });
        });
    });*/
});