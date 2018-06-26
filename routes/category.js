module.exports = function(app, models) {

  app.get("/categories", function(req, res, next) {
        
        var Category = models.Category;
        var request = {
            attributes: ["idCategory", "nameCategory"],  
        };
        Category.findAll(request).then(function(result){
            if(result){
                res.json({
                    "code" : 0,
                    "message" : null,
                    "result": result
                });
            }else{
                res.json({
                    "code" : 3,
                    "message" : "Category not found",
                    "result": null
                });
            }
        });
    });

};