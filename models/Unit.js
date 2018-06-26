var sequelize = require("./sequelize");

module.exports = sequelize.import("unit", function(sequelize, Datatypes) {
	return sequelize.define("Unit", {
		idUnit : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
		},
		nameUnit : {
			type : Datatypes.STRING
		}
	}, {
		charset: 'utf8',
		collate: 'utf8_unicode_ci',
		paranoid : true,
		freezeTab : true,
		tableName : "unit"
	});
});