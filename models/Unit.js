var sequelize = require("./sequelize");

module.exports = sequelize.import("unit", function(sequelize, Datatypes) {
	return sequelize.define("Unit", {
		id : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
		},
		name : {
			type : Datatypes.STRING
		}
	}, {
		paranoid : true,
		freezeTab : true,
		tableName : "Unit"
	});
});