var sequelize = require("./sequelize");

module.exports = sequelize.import("signalOrderLigneOrder", function(sequelize, Datatypes) {
	return sequelize.define("SignalOrderLigneOrder", {
		idSignalOrderLigneOrder : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
		},
		idLigneOrderSignalOrderLigneOrder : {
			type : Datatypes.INTEGER
        },
        idSignalOrderSignalOrderLigneOrder : {
			type : Datatypes.INTEGER
		},
	}, {
		charset: 'utf8',
		collate: 'utf8_unicode_ci',
		paranoid : true,
		freezeTab : true,
		tableName : "signalorderligneorder"
	});
});
