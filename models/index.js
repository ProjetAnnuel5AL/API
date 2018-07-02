var seq = require("./sequelize");
var UserModel = require("./User");
var CategoryModel = require("./Category");
var ItemModel = require("./Item");
var ProductModel = require("./Product");
var UnitModel = require("./Unit");
var ProducerModel = require("./Producer");
var CommentProducerModel = require("./CommentProducer");
var ProducersGroupModel = require("./ProducersGroup");
var ProducersGroupMemberModel = require("./ProducersGroupMember");
var Notification = require("./Notification");
var PaypalTransact = require("./PaypalTransact");
var Order = require("./Order");
var LigneOrder = require("./LigneOrder");
var Motif = require("./Motif");
var SignalOrder = require("./SignalOrder");
var SignalOrderLigneOrder = require("./SignalOrderLigneOrder");
var Report = require("./Report");


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
    "ProducersGroup": ProducersGroupModel,
    "ProducersGroupMember": ProducersGroupMemberModel,
    "Notification": Notification,
    "PaypalTransact": PaypalTransact,
    "Order": Order,
    "LigneOrder" : LigneOrder,
    "Motif" : Motif,
    "SignalOrder": SignalOrder,
    "SignalOrderLigneOrder": SignalOrderLigneOrder,
    "Report": Report
};
