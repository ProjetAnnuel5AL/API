var sequelize = require("./sequelize");

module.exports = sequelize.import("product", function(sequelize, Datatypes) {
	return sequelize.define("Product", {
		idProduct : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
		},
		nameProduct : {
			type : Datatypes.STRING
		},
		idCategoryProduct : {
			type : Datatypes.INTEGER
		},
	}, {
		charset: 'utf8',
		collate: 'utf8_unicode_ci',
		paranoid : true,
		freezeTab : true,
		tableName : "product"
	});
});
