var sequelize = require("./sequelize");

module.exports = sequelize.import("Item", function(sequelize, Datatypes) {
	return sequelize.define("Item", {
		id : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
		},
		price : {
			type : Datatypes.FLOAT
		},
		adress : {
			type : Datatypes.STRING
		},
		city : {
			type : Datatypes.STRING
		},
		location : {
			type : Datatypes.STRING
		},
		quantity : {
			type : Datatypes.FLOAT
		},
		name : {
			type : Datatypes.STRING
		},
		fileExtensions : {
			type : Datatypes.STRING
		},
		description : {
			type : Datatypes.TEXT
		},
		//kg, unité, litres, etc
		unitId : {
			type : Datatypes.INTEGER
		},
		idProduct : {
			type : Datatypes.INTEGER
		},
		idUser : {
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
