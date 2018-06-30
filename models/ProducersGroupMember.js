var sequelize = require("./sequelize");

module.exports = sequelize.import("producersGroupMember", function(sequelize, Datatypes) {
	return sequelize.define("ProducersGroupMember", {
		id : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
		},
		idUser : {
			type : Datatypes.INTEGER
		},
		idGroup : {
			type : Datatypes.INTEGER
		},
	}, {
		paranoid : true,
		freezeTab : true,
		tableName : "producersGroupMember"
	});
});
