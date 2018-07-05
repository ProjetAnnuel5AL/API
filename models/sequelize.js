var Sequelize = require("sequelize");
var config = require("config");  // we use node-config to handle environments
require("../env.js");

var dbConfig;
var log =true;
if (process.env.NODE_ENV === "test") {
    dbConfig =	config.get("test");
    log =false;
} else if(process.env.NODE_ENV === "development") {
    dbConfig = config.get("development");
} else if(process.env.NODE_ENV === "production"){
    dbConfig = config.get("production");
}



module.exports = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        logging: log
    }
);
