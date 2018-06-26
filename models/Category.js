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
		charset: 'utf8',
		collate: 'utf8_unicode_ci',
		paranoid : true,
		freezeTab : true,
		tableName : "category"
	});
});
