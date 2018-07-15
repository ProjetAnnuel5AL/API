var sequelize = require("./sequelize");

module.exports = sequelize.import("producersGroupEvent", function(sequelize, Datatypes) {
	return sequelize.define("ProducersGroupEvent", {
		idEvent : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
		},
		idGroup : {
			type : Datatypes.INTEGER
		},
		nameEvent : {
			type : Datatypes.STRING
		},
    adressEvent : {
      type : Datatypes.STRING
    },
		cityEvent : {
			type : Datatypes.STRING
		},
		locationEvent : {
			type : Datatypes.STRING
		},
		latEvent : {
			type : Datatypes.FLOAT
		},
		longEvent : {
			type : Datatypes.FLOAT
		},
		descriptionEvent : {
			type : Datatypes.TEXT
		},
		dateEvent : {
			type : Datatypes.DATE
		}
	}, {
		paranoid : true,
		freezeTab : true,
		tableName : "producersGroupEvent"
	});
});
