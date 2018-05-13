module.exports = function(app, models) {
    
  app.get("/units", function(req, res, next) {
        
        var Unit = models.Unit;
        var request = {
            attributes: ["id", "name"],  
        };
        Unit.findAll(request).then(function(result){
            if(result){
                res.json(result);
            }else{
                res.json({
                    "code" : 3,
                    "message" : "Unit not found"
                });
            }
        });
    
    });
};