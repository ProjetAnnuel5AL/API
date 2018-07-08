var sequelize = require("./sequelize");

module.exports = sequelize.import("producersGroup", function(sequelize, Datatypes) {
	return sequelize.define("ProducersGroup", {
		id : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
    },
    founderUserId : {
			type : Datatypes.INTEGER,
			//unique: true
		},
		avatar : {
			type : Datatypes.STRING
		},
		name : {
			type : Datatypes.STRING
    },
    email : {
			type : Datatypes.STRING
        },
    phone : {
			type : Datatypes.STRING
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
		latGroup : {
			type : Datatypes.FLOAT
		},
		longGroup : {
			type : Datatypes.FLOAT
		},
		description : {
			type : Datatypes.TEXT
		},
	}, 
  {
		paranoid : true,
		freezeTab : true,
		tableName : "producersGroup"
	});
});
