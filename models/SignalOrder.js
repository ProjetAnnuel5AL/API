var sequelize = require("./sequelize");

module.exports = sequelize.import("signalOrder", function(sequelize, Datatypes) {
	return sequelize.define("SignalOrder", {
		idSignalOrder : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
		},
		dateSignalOrder : {
			type : Datatypes.DATE
        },
        descriptionSignalOrder : {
            type : Datatypes.TEXT
        },
		idMotifSignalOrder : {
			type : Datatypes.INTEGER
        },
        idUserSignalOrder: {
			type : Datatypes.INTEGER
        },
	}, {
		charset: 'utf8',
		collate: 'utf8_unicode_ci',
		paranoid : true,
		freezeTab : true,
		tableName : "signalorder"
	});
});
