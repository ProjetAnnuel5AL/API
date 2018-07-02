module.exports = function(app, models) {

    app.get("/motif/order", function(req, res, next) {
        var Motif = models.Motif;
        request = {
            where: {
                typeMotif: "ORDER"
            }
        }
        Motif.findAll(request).then(function(result){
            if(result){
                res.json({
                    "code" : 0,
                    "message" : null,
                    "result": result
                });
            }else{
                res.json({
                    "code" : 3,
                    "message" : "Motif ORDER not found",
                    "result": null
                });
            }
        });
    });

    app.get("/motif/producer", function(req, res, next) {
        var Motif = models.Motif;
        request = {
            where: {
                typeMotif: "PRODUCER"
            }
        }
        Motif.findAll(request).then(function(result){
            if(result){
                res.json({
                    "code" : 0,
                    "message" : null,
                    "result": result
                });
            }else{
                res.json({
                    "code" : 3,
                    "message" : "Motif producer not found",
                    "result": null
                });
            }
        });
    });

    app.get("/motif/item", function(req, res, next) {
        var Motif = models.Motif;
        request = {
            where: {
                typeMotif: "ITEM"
            }
        }
        Motif.findAll(request).then(function(result){
            if(result){
                res.json({
                    "code" : 0,
                    "message" : null,
                    "result": result
                });
            }else{
                res.json({
                    "code" : 3,
                    "message" : "Motif item not found",
                    "result": null
                });
            }
        });
    });

    app.get("/motif/producerGroup", function(req, res, next) {
        var Motif = models.Motif;
        request = {
            where: {
                typeMotif: "PRODUCERGROUP"
            }
        }
        Motif.findAll(request).then(function(result){
            if(result){
                res.json({
                    "code" : 0,
                    "message" : null,
                    "result": result
                });
            }else{
                res.json({
                    "code" : 3,
                    "message" : "Motif PRODUCERGROUP not found",
                    "result": null
                });
            }
        });
    });

};