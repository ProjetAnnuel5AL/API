var sequelize = require("./sequelize");

module.exports = sequelize.import("delivery", function(sequelize, Datatypes) {
	return sequelize.define("Delivery", {
		idDelivery : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
		},
		nameDelivery : {
			type : Datatypes.STRING
        },
        siteDelivery : {
            type : Datatypes.STRING
        }
	}, {
		charset: 'utf8',
		collate: 'utf8_unicode_ci',
		paranoid : true,
		freezeTab : true,
		tableName : "delivery"
	});
});
