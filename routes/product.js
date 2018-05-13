module.exports = function(app, models) {
  app.get("/products/findByCategoryId", function(req, res, next) {
        if (req.query.id){
            var Product = models.Product;
            var request = {
                where: {
                    categoryId : req.query.id
                }
            };
            Product.findAll(request).then(function(result) {
                if (result){
                    res.json({
                        "code" : 0,
                        "products" : result
                    });
                } else {
                    res.json({
                        "code" : 3,
                        "message" : "Products not found"
                    });
                }
            });
        } else {
            res.json({
                "code" : 1,
                "message" : "Missing required parameters"
            });
        }
    });
};