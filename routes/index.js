module.exports = function(app, models, TokenUtils, utils) {

	require("./user")(app, models, TokenUtils, utils);
	require("./unit")(app, models);
	require("./category")(app, models);
	require("./producer")(app, models, TokenUtils);
	require("./item")(app, models, TokenUtils);
	require("./product")(app, models);

};
