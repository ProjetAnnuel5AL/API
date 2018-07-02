module.exports = function(app, models) {

    app.get("/motif", function(req, res, next) {
        var Motif = models.Motif;
        Motif.findAll().then(function(result){
            if(result){
                res.json({
                    "code" : 0,
                    "message" : null,
                    "result": result
                });
            }else{
                res.json({
                    "code" : 3,
                    "message" : "Motif not found",
                    "result": null
                });
            }
        });
    });

};