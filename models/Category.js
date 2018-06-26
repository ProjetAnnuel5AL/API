var sequelize = require("./sequelize");

module.exports = sequelize.import("category", function(sequelize, Datatypes) {
	return sequelize.define("Category", {
		idCategory : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
		},
		nameCategory : {
			type : Datatypes.STRING
		}
	}, {
		charset: 'utf8',
		collate: 'utf8_unicode_ci',
		paranoid : true,
		freezeTab : true,
		tableName : "category"
	});
});
