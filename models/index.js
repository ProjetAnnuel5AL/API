var seq = require("./sequelize");
var UserModel = require("./User");

seq.sync();

module.exports = {
    "sequelize" : seq,
    "User" : UserModel,
};
