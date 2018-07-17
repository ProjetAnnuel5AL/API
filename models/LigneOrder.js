var sequelize = require("./sequelize");

module.exports = sequelize.import("ligneorder", function(sequelize, Datatypes) {
	return sequelize.define("LigneOrder", {
		idLigneOrder : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
        },
        idOrderLigneOrder : {
            type : Datatypes.INTEGER,
        },
        idProducerLigneOrder : {
            type : Datatypes.INTEGER,
        },
        idItemLigneOrder : {
            type : Datatypes.INTEGER,
        },
        unitLigneOrder : {
			type : Datatypes.STRING
		},
        categoryLigneOrder : {
			type : Datatypes.STRING
        },
        productLigneOrder : {
			type : Datatypes.STRING
        },
        titleLigneOrder : {
			type : Datatypes.STRING
		},
        quantiteLigneOrder : {
            type : Datatypes.FLOAT,
        },
        prixUnitaireLigneOrder : {
            type : Datatypes.FLOAT,
        },
        shippingCostLigneOrder : {
            type : Datatypes.FLOAT,
        },
        deliveryTimeLigneOrder : {
            type : Datatypes.STRING,
        },
        idDeliveryLigneOrder : {
            type : Datatypes.INTEGER,
        }
	}, {
        charset: 'utf8',
		collate: 'utf8_unicode_ci',
		paranoid : true,
		freezeTab : true,
		tableName : "ligneOrder"
	});
});