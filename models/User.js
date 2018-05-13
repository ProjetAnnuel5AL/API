var sequelize = require("./sequelize");

module.exports = sequelize.import("user", function(sequelize, Datatypes) {
	return sequelize.define("User", {
		idUser : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
		},
		loginUser : {
			type : Datatypes.STRING
		},
		emailUser : {
			type : Datatypes.STRING
		},
		passwordUser : {
			type : Datatypes.STRING
		},
		typeUser : {
			type : Datatypes.STRING
		}
	}, {
		paranoid : true,
		freezeTab : true,
		tableName : "user"
	});
});
