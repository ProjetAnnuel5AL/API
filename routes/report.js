module.exports = function(app, models) {

    app.post("/report/item", function(req, res, next) {
        var Report = models.Report;
        if(req.body.idMotif && req.body.idItem){
            Report.create({
                dateReport : new Date(),
                idMotifReport :req.body.idMotif,
                idItemReport : req.body.idItem
            }).then(function(result){
                res.json({
                    "code" : 0,
                    "message" : null,
                    "result": result
                });
            }).catch(function(err){
                res.json({
                    "code": 2,
                    "message": "Sequelize error",
                    "result": null
                });
            });
        }else{
            res.json({
                "code": 1,
                "message": "Missing required parameters",
                "result": null
            });
        }
    });

    
    app.post("/report/producer", function(req, res, next) {
        var Report = models.Report;
        if(req.body.idMotif && req.body.idProducer){
            Report.create({
                dateReport : new Date(),
                idMotifReport :req.body.idMotif,
                idProducerReport : req.body.idProducer
            }).then(function(result){
                res.json({
                    "code" : 0,
                    "message" : null,
                    "result": result
                });
            
            }).catch(function(err){
                res.json({
                    "code": 2,
                    "message": "Sequelize error",
                    "result": null
                });
            });
        }else{
            res.json({
                "code": 1,
                "message": "Missing required parameters",
                "result": null
            });
        }
    });

   
    app.post("/report/producerGroup", function(req, res, next) {
        var Report = models.Report;
        if(req.body.idMotif && req.body.idProducerGroup){
            Report.create({
                dateReport : new Date(),
                idMotifReport :req.body.idMotif,
                idProducerGroupReport : req.body.idProducerGroup
            }).then(function(result){
                res.json({
                    "code" : 0,
                    "message" : null,
                    "result": result
                });
            
            }).catch(function(err){
                res.json({
                    "code": 2,
                    "message": "Sequelize error",
                    "result": null
                });
            });
        }else{
            res.json({
                "code": 1,
                "message": "Missing required parameters",
                "result": null
            });
        }
    });
}