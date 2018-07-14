var sequelize = require("./sequelize");

module.exports = sequelize.import("producersGroupEventParticipant", function(sequelize, Datatypes) {
	return sequelize.define("ProducersGroupEventParticipant", {
		idParticipant : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
		},
		idUser : {
			type : Datatypes.INTEGER
		},
		idEvent : {
			type : Datatypes.INTEGER
		},
    //0 = user, 1=producer
    typeParticipant : {
      type : Datatypes.INTEGER
    },
    //producers Only: maraîcher, vigneron, etc...
    libelleParticipant : {
      type : Datatypes.STRING
    }
	}, {
		paranoid : true,
		freezeTab : true,
		tableName : "producersGroupEventParticipant"
	});
});
