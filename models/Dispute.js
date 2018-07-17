var sequelize = require("./sequelize");

module.exports = sequelize.import("dispute", function(sequelize, Datatypes) {
	return sequelize.define("Dispute", {
		idDispute : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
		},
		dateDispute : {
			type : Datatypes.DATE
        },
        descriptionDispute : {
            type : Datatypes.TEXT
		},
		//NEW
		//ACCEPTED
		//CONTESTED
		//CLOSE 
		statusDispute : {
			type: Datatypes.STRING
		},
		contestDescriptionDispute : {
			type: Datatypes.TEXT
		},
		//PRODUCER
		//USER
		winnerContestDispute : {
			type: Datatypes.STRING
		},
		winnerContestDescriptionDispute : {
			type: Datatypes.TEXT
		},
		idMotifDispute : {
			type : Datatypes.INTEGER
        },
        idUserDispute: {
			type : Datatypes.INTEGER
		},
		
	}, {
		charset: 'utf8',
		collate: 'utf8_unicode_ci',
		paranoid : true,
		freezeTab : true,
		tableName : "dispute"
	});
});
