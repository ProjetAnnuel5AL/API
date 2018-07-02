module.exports = function(app, models, TokenUtils, utils, urlSite, urlApi) {


	app.get('/', function (req, res) {
		res.send('Hello on API V3 !');
	});


	require("./user")(app, models, TokenUtils, utils, urlApi, urlSite);
	require("./unit")(app, models);
	require("./category")(app, models);
	require("./producer")(app, models, TokenUtils, utils);
	require("./item")(app, models, TokenUtils, utils);
	require("./product")(app, models);
	require("./producersGroup")(app, models, TokenUtils, utils);
	require("./producersGroupMember")(app, models, TokenUtils, utils);
	require("./notification")(app, models, TokenUtils, utils);
	require("./paypalTransact")(app, models, TokenUtils, utils);
	require("./order")(app, models, TokenUtils, utils);
	require("./motif")(app, models);
};
