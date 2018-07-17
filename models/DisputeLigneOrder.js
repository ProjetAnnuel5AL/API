var sequelize = require("./sequelize");

module.exports = sequelize.import("disputeLigneOrder", function(sequelize, Datatypes) {
	return sequelize.define("DisputeLigneOrder", {
		idDisputeLigneOrder : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
		},
		idLigneOrderDisputeLigneOrder : {
			type : Datatypes.INTEGER
        },
        idDisputeDisputeLigneOrder : {
			type : Datatypes.INTEGER
		},
	}, {
		charset: 'utf8',
		collate: 'utf8_unicode_ci',
		paranoid : true,
		freezeTab : true,
		tableName : "disputeLigneOrder"
	});
});
