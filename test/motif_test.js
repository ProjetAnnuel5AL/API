var request = require("supertest-session");
var api=require("../index.js");
var models = require("../models");
var utils = require("../utils");
var utf8 = require('utf8');
var CryptoUtils = utils.CryptoUtils;
var crpt = new CryptoUtils();

describe("motif", function(){
   
    before(function () {
        var sequelize = models.sequelize;
        sequelize.query('TRUNCATE TABLE motif');
        var Motif = models.Motif;
        Motif.create({
            idMotif : 1,
            nameMotif : "Commande non reçu",
            typeMotif: "ORDER",
            libelleMotif: "Je n'ai pas reçu ma commande"
        })
        Motif.create({
            idMotif : 2,
            nameMotif : "Commande incomplète",
            typeMotif: "ORDER",
            libelleMotif: "La commande que j'ai reçu est incomplète"
        })
    });

    afterEach(function () {
        //console.log('afterEach run!');
    });

  /*  describe("GET /motif/order",function(){

        it("should find 2 motif type order", function(done){
            request(api).get("/motif/order")
                .type("form")
                .send()
                .expect(200)
                .expect({"code" : 0, "message" : null, "result" : [{
                    idMotif : 1,
                    nameMotif : "Commande non reçu",
                    typeMotif: "ORDER",
                    libelleMotif: "Je n'ai pas reçu ma commande"
                },{
                    idMotif : 2,
                    nameMotif : "Commande incomplète",
                    typeMotif: "ORDER",
                    libelleMotif: "La commande que j'ai reçu est incomplète"
                }]})
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