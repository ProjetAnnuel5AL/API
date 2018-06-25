var seq = require("./sequelize");
var UserModel = require("./User");
var CategoryModel = require("./Category");
var ItemModel = require("./Item");
var ProductModel = require("./Product");
var UnitModel = require("./Unit");
var ProducerModel = require("./Producer");
var CommentProducerModel = require("./CommentProducer");
var PaypalTransact = require("./PaypalTransact");
var Order = require("./Order");
var LigneOrder = require("./LigneOrder");

seq.sync();

module.exports = {
    "sequelize" : seq,
    "User" : UserModel,
    "Category" : CategoryModel,
    "Item" : ItemModel,
    "Product" : ProductModel,
    "Unit": UnitModel,
    "Producer": ProducerModel,
    "CommentProducer": CommentProducerModel,
    "PaypalTransact": PaypalTransact,
    "Order": Order,
    "LigneOrder" : LigneOrder
};
