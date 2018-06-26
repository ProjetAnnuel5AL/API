module.exports = function(app, models) {
    
  app.get("/units", function(req, res, next) {
        
        var Unit = models.Unit;
        var request = {
            attributes: ["idUnit", "nameUnit"],  
        };
        Unit.findAll(request).then(function(result){
            if(result){
                res.json({
                   "code": 0,
                   "message": null,
                   "result" : result,
                });
            }else{
                res.json({
                    "code" : 3,
                    "message" : "Unit not found",
                    "result" : null
                });
            }
        });
    
    });
};