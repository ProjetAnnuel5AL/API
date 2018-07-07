module.exports = function(app, models) {

  app.get("/delivery", function(req, res, next) {
        
        var Delivery = models.Delivery;
    
        Delivery.findAll({ order: ['nameDelivery']}).then(function(result){
            if(result){
                res.json({
                    "code" : 0,
                    "message" : null,
                    "result": result
                });
            }else{
                res.json({
                    "code" : 3,
                    "message" : "Delivery not found",
                    "result": null
                });
            }
        });
    });

};