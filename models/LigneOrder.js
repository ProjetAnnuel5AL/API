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
        idProducerOrder : {
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
        }
	}, {
		paranoid : true,
		freezeTab : true,
		tableName : "LigneOrder"
	});
});