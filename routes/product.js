module.exports = function(app, models) {
  app.get("/products/findByCategoryId", function(req, res, next) {
        if (req.query.id){
            var Product = models.Product;
            var request = {
                where: {
                    idCategoryProduct : req.query.id
                }
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
};