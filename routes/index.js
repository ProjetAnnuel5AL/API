module.exports = function(app, models, TokenUtils) {

	require("./user")(app, models, TokenUtils);
	require("./unit")(app, models);
	require("./category")(app, models);
	require("./producer")(app, models, TokenUtils);
	require("./item")(app, models);
	require("./product")(app, models);

};
