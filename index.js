var express  = require("express");
var app = express();
var models = require("./models");
var utils = require("./utils");
var TokenUtils = utils.TokenUtils;

var config = require("config");  // we use node-config to handle environments
require("./env.js");

var bodyParser = require("body-parser");

var urlApi = "http://localhost:8082";
var urlLocal = "http://localhost:8888"

module.exports = app;
/*app.use(
    session({
        secret: "vidyapathaisalwaysrunning",
        resave: true,
        saveUninitialized: true
    })
);*/

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(bodyParser.json());
app.use(express.static(__dirname + "/ressources"));
require("./routes")(app, models, TokenUtils, utils, urlLocal, urlApi);

var port=process.env.PORT || 8888;

var server = app.listen(port, function() {
    console.log("Server started port "+port+"...");
});