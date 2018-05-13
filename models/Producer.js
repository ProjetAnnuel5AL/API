var sequelize = require("./sequelize");

module.exports = sequelize.import("producer", function(sequelize, Datatypes) {
	return sequelize.define("Producer", {
		idProducer : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
        },
        idUserProducer : {
			type : Datatypes.INTEGER,
			//unique: true
		},
		lastNameProducer : {
			type : Datatypes.STRING
		},
		avatarProducer : {
			type : Datatypes.STRING
		},
		firstNameProducer : {
			type : Datatypes.STRING
        },
        emailProducer : {
			type : Datatypes.STRING
        },
        phoneProducer : {
			type : Datatypes.STRING
		},
		birthProducer : {
			type : Datatypes.DATEONLY
		},
		sexProducer : {
			type : Datatypes.STRING
		},
		addressProducer : {
			type : Datatypes.STRING
		},
		cityProducer : {
			type : Datatypes.STRING
		},
		cpProducer : {
			type : Datatypes.STRING
		},
		descriptionProducer : {
			type : Datatypes.TEXT
		}
	}, {
		paranoid : true,
		freezeTab : true,
		tableName : "producer"
	});
});
