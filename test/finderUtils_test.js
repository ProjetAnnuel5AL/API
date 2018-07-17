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


   /* describe("finderUtils CheckEmailUser ",function(){

        it("should return null", function(done){ 
            var FinderUtils = utils.FinderUtils;
            FinderUtils.CheckEmailUser("").expect(null,done)
        });
 
    });*/

});