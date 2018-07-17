var request = require("supertest-session");
var api=require("../index.js");
var models = require("../models");
var utils = require("../utils");
var utf8 = require('utf8');
var CryptoUtils = utils.CryptoUtils;
var crpt = new CryptoUtils();

describe("Delivery", function(){
   
    before(function () {
        var sequelize = models.sequelize;
        sequelize.query('TRUNCATE TABLE delivery');
        var Delivery = models.Delivery;
        Delivery.create({"idDelivery":4,"nameDelivery":"Colissimo","siteDelivery":"https://www.laposte.fr/professionnel/outils/suivre-vos-envois"})
        Delivery.create({"idDelivery":3,"nameDelivery":"DHL","siteDelivery":"https://www.dhl.fr/fr/dhl_express/suivi_expedition.html"})
    });

    afterEach(function () {
        //console.log('afterEach run!');
    });

    describe("GET /Delivery",function(){

      /*  it("should find 2 delivery order by name", function(done){
            request(api).get("/delivery")
                .type("form")
                .send()
                .expect(200)
                .expect({"code" : 0, "message" : null, "result" : [ {"idDelivery":4,"nameDelivery":"Colissimo","siteDelivery":"https://www.laposte.fr/professionnel/outils/suivre-vos-envois"},{"idDelivery":3,"nameDelivery":"DHL","siteDelivery":"https://www.dhl.fr/fr/dhl_express/suivi_expedition.html"}]})
                .end(function(err,res){
                if(err) {
                    done(err);
                }else{
                    done();
                }
            });
        });

        it("should not find delivery", function(done){
            var sequelize = models.sequelize;
            sequelize.query('TRUNCATE TABLE delivery');
            request(api).get("/delivery")
                .type("form")
                .send()
                .expect(200)
                .expect({"code" : 0, "message" : null, "result" : []})
                .end(function(err,res){
                if(err) {
                    done(err);
                }else{
                    done();
                }
            });
        });*/

    });
});