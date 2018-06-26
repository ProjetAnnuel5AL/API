var sequelize = require("./sequelize");

module.exports = sequelize.import("product", function(sequelize, Datatypes) {
	return sequelize.define("Product", {
		id : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
		},
		categoryId : {
			type : Datatypes.INTEGER
		},
		name : {
			type : Datatypes.STRING
		}
	}, {
		charset: 'utf8',
		collate: 'utf8_unicode_ci',
		paranoid : true,
		freezeTab : true,
		tableName : "product"
	});
});
