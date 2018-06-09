module.exports = function(app, models, TokenUtils, utils, urlLocal, urlApi) {

	require("./user")(app, models, TokenUtils, utils, urlApi);
	require("./unit")(app, models);
	require("./category")(app, models);
	require("./producer")(app, models, TokenUtils);
	require("./item")(app, models, TokenUtils);
	require("./product")(app, models);

};
