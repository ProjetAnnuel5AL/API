module.exports = function(app, models) {
  app.get("/products/findByCategoryId", function(req, res, next) {
        if (req.query.id){
            var Product = models.Product;
            var request = {
                where: {
                    idCategoryProduct : req.query.id
                },
                order: ['nameProduct'] 
            };
            Product.findAll(request).then(function(result) {
                if (result){
                    res.json({
                        "code" : 0,
                        "message" : null,
                        "result" : result
                    });
                } else {
                    res.json({
                        "code" : 3,
                        "message" : "Products not found",
                        "result": null,
                    });
                }
            });
        } else {
            res.json({
                "code" : 1,
                "message" : "Missing required parameters",
                "result": null,
            });
        }
    });

    app.get("/products", function(req, res, next) {
        
        var Product = models.Product;
        var request = { 
            order: ['nameProduct'] 
        };
        Product.findAll(request).then(function(result){
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