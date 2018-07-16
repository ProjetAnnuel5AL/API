var sequelize = require("./sequelize");

module.exports = sequelize.import("paypalTransact", function(sequelize, Datatypes) {
	return sequelize.define("PaypalTransact", {
		idPaypalTransact : {
			type : Datatypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
        },
        idLigneOrderPaypalTransact : {
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
        //SUCCESS : TERMINE
        //FAIL : probleme lors du paiement.
        //DISPUTES : litige
        //REFUND : remboursement a faire
        statusPaypalTransact: {
            type : Datatypes.STRING,
        }
	}, {
        charset: 'utf8',
		collate: 'utf8_unicode_ci',
		paranoid : true,
		freezeTab : true,
		tableName : "paypalTransact"
	});
});