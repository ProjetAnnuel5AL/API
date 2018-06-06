module.exports = function(app, models, TokenUtils) {

	app.get('/', function (req, res) {
		res.send('Hello on API V3 !');
	});

	require("./user")(app, models, TokenUtils);
	require("./unit")(app, models);
	require("./category")(app, models);
	require("./producer")(app, models, TokenUtils);
	require("./item")(app, models, TokenUtils);
	require("./product")(app, models);

};
