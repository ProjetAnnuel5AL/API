var sequelize = require("./sequelize");

module.exports = sequelize.import("report", function(sequelize, Datatypes) {
	return sequelize.define("Report", {
		idReport : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
        },
        dateReport : {
			type : Datatypes.DATE
        },
		idMotifReport : {
			type : Datatypes.INTEGER
        },
        idItemReport : {
			type : Datatypes.INTEGER
        },
        idProducerReport : {
			type : Datatypes.INTEGER
        },
        idProducerGroupReport : {
			type : Datatypes.INTEGER
		}
	}, {
		charset: 'utf8',
		collate: 'utf8_unicode_ci',
		paranoid : true,
		freezeTab : true,
		tableName : "report"
	});
});
