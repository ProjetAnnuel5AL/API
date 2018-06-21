module.exports = function(app, models, TokenUtils, utils, urlLocal, urlApi) {

	require("./user")(app, models, TokenUtils, utils, urlApi);
	require("./unit")(app, models);
	require("./category")(app, models);
	require("./producer")(app, models, TokenUtils, utils);
	require("./item")(app, models, TokenUtils, utils);
	require("./product")(app, models);
	require("./paypalTransact")(app, models, TokenUtils, utils);
	require("./order")(app, models, TokenUtils, utils);

};
