var express  = require("express");
var app = express();
var models = require("./models");

module.exports = app;
/*app.use(
    session({
        secret: "vidyapathaisalwaysrunning",
        resave: true,
        saveUninitialized: true
    })
);*/

require("./routes")(app, models);

var port=process.env.PORT || 8888;

var server = app.listen(port, function() {
    console.log("Server started port 8888...");
});