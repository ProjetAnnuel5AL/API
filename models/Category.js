var sequelize = require("./sequelize");

module.exports = sequelize.import("category", function(sequelize, Datatypes) {
	return sequelize.define("Category", {
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
		tableName : "Category"
	});
});
