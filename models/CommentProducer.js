var sequelize = require("./sequelize");

module.exports = sequelize.import("commentProducer", function(sequelize, Datatypes) {
	return sequelize.define("CommentProducer", {
		idCommentProducer : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
        },
        idProducer : {
			type : Datatypes.INTEGER,
		},
		idUser : {
			type : Datatypes.INTEGER,
		},
		comment : {
			type : Datatypes.TEXT,
		},
		starComment : {
			type : Datatypes.INTEGER,
		},
		dateComment  : {
			type : Datatypes.DATEONLY
		},
	}, {
		charset: 'utf8',
		collate: 'utf8_unicode_ci',
		paranoid : true,
		freezeTab : true,
		tableName : "commentProducer"
	});
});
