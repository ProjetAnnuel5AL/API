var sequelize = require("./sequelize");

module.exports = sequelize.import("order", function(sequelize, Datatypes) {
	return sequelize.define("Order", {
		idOrder : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
        },
        idUserOrder : {
            type : Datatypes.INTEGER,
        },
		dateOrder : {
			type : Datatypes.DATE
        },
        lastNameOrder : {
			type : Datatypes.STRING
		},
		firstNameOrder : {
			type : Datatypes.STRING
		},
		sexOrder : {
			type : Datatypes.STRING
		},
		addressOrder : {
			type : Datatypes.STRING
		},
		cityOrder : {
			type : Datatypes.STRING
		},
		cpOrder : {
			type : Datatypes.STRING
		},
		totalOrder : {
			type : Datatypes.FLOAT
		},
		//Dans le cas ou l'on doit effectuer un remboursement, on doit enregistré l'id du paiement a refound 
		idPaypalPaiement : {
			type : Datatypes.STRING
		},
	},{
		charset: 'utf8',
		collate: 'utf8_unicode_ci',
		paranoid : true,
		freezeTab : true,
		tableName : "order"
	});
});