module.exports = function(app, models) {
  app.get("/categories", function(req, res, next) {
        
        var Category = models.Category;
        var request = {
            attributes: ["id", "name"],  
        };
        Category.findAll(request).then(function(result){
            if(result){
                res.json(result);
            }else{
                res.json({
                    "code" : 3,
                    "message" : "Category not found"
                });
            }
        });
    
    });
};