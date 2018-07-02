var sequelize = require("./sequelize");

module.exports = sequelize.import("motif", function(sequelize, Datatypes) {
	return sequelize.define("Motif", {
		idMotif : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
		},
		nameMotif : {
			type : Datatypes.STRING
		},
		libelleMotif : {
			type : Datatypes.STRING
		}
	}, {
		charset: 'utf8',
		collate: 'utf8_unicode_ci',
		paranoid : true,
		freezeTab : true,
		tableName : "motif"
	});
});
