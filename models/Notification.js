var sequelize = require("./sequelize");

module.exports = sequelize.import("Notification", function(sequelize, Datatypes) {
	return sequelize.define("Notification", {
		id : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
		},
		idUser : {
			type : Datatypes.INTEGER
		},
    	//"choice" ou "info", dans la cas d'info, l'url n'est pas necessaire (L'url correspond au choix "Oui")
		type : {
			type : Datatypes.STRING
		},
		url : {
			type : Datatypes.STRING
		},
		title : {
			type : Datatypes.STRING
		},
		description : {
			type : Datatypes.STRING
		}
	}, {
		paranoid : true,
		freezeTab : true,
		tableName : "notification"
	});
});
