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
		codeResetPasswordUser : {
			type : Datatypes.STRING
		},
		saltUser : {
			type : Datatypes.STRING
		},
		typeUser : {
			type : Datatypes.INTEGER
		},
		mailValidationUser : {
			type : Datatypes.BOOLEAN
		},
		validationCodeUser : {
			type : Datatypes.STRING
		},
		lastNameUser : {
			type : Datatypes.STRING
		},
		firstNameUser : {
			type : Datatypes.STRING
		},
		birthUser : {
			type : Datatypes.DATEONLY
		},
		sexUser : {
			type : Datatypes.STRING
		},
		addressUser : {
			type : Datatypes.STRING
		},
		cityUser : {
			type : Datatypes.STRING
		},
		cpUser : {
			type : Datatypes.STRING
		},
	}, {
		paranoid : true,
		freezeTab : true,
		tableName : "user"
	});
});
