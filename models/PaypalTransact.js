var sequelize = require("./sequelize");

module.exports = sequelize.import("paypalTransact", function(sequelize, Datatypes) {
	return sequelize.define("PaypalTransact", {
		idPaypalTransact : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
        },
        idOrderPaypalTransact : {
            type : Datatypes.INTEGER,
        },
        idProducerPaypalTransact : {
            type : Datatypes.INTEGER,
        },
        idUserPaypalTransact : {
            type : Datatypes.INTEGER,
        },
        //date a laquelle la transactionle paiement user a été fait
        datePaypalTransact : {
            type : Datatypes.DATE,
        },
        //date a laquelle on a redistribuer au producteur
        dateRediPaypalTransact : {
            type : Datatypes.DATE,
        },
        //correspond a l'id user chez paypal (pour remboursement)
        payerIDPaypalTransact : {
            type : Datatypes.STRING,
        },
        //montant de la transaction
        valuePaypalTransact : {
            type : Datatypes.FLOAT,
        },
        //identifiant de la requetes paypout chez paypal
        batchIdPaypalTransact: {
            type : Datatypes.STRING,
        },
        //identifiant d'un item d'une requete payour paypal
        itemIdPaypalTransact: {
            type : Datatypes.STRING,
        },
        //PENDING : en attente de validation de reception
        //TO DO : reception validé ou plus de N jour
        //SUCCESS : paiement effectué
        //FAIL : probleme lors du paiement.
        statusPaypalTransact: {
            type : Datatypes.STRING,
        }
	}, {
		paranoid : true,
		freezeTab : true,
		tableName : "PaypalTransact"
	});
});