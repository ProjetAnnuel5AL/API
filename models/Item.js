var sequelize = require("./sequelize");

module.exports = sequelize.import("Item", function(sequelize, Datatypes) {
	return sequelize.define("Item", {
		idItem : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
		},
		priceItem : {
			type : Datatypes.FLOAT
		},
		addressItem : {
			type : Datatypes.STRING
		},
		cityItem : {
			type : Datatypes.STRING
		},
		locationItem : {
			type : Datatypes.STRING
		},
		quantityItem : {
			type : Datatypes.FLOAT
		},
		nameItem : {
			type : Datatypes.STRING
		},
		fileExtensionsItem : {
			type : Datatypes.STRING
		},
		descriptionItem : {
			type : Datatypes.TEXT
		},
		//kg, unité, litres, etc
		idUnitItem : {
			type : Datatypes.INTEGER
		},
		idProductItem : {
			type : Datatypes.INTEGER
		},
		idUserItem : {
			type : Datatypes.INTEGER
		}
	}, {
		charset: 'utf8',
		collate: 'utf8_unicode_ci',
		paranoid : true,
		freezeTab : true,
		tableName : "item"
	});
});
