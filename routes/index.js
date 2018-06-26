module.exports = function(app, models, TokenUtils, utils, urlSite, urlApi) {

	require("./user")(app, models, TokenUtils, utils, urlApi, urlSite);
	require("./unit")(app, models);
	require("./category")(app, models);
	require("./producer")(app, models, TokenUtils, utils);
	require("./item")(app, models, TokenUtils, utils);
	require("./product")(app, models);
	require("./paypalTransact")(app, models, TokenUtils, utils);
	require("./order")(app, models, TokenUtils, utils);

};
