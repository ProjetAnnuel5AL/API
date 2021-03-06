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
var ProducersGroupSubscriberModel = require("./ProducersGroupSubscriber");
var ProducersGroupEventModel = require("./ProducersGroupEvent");
var ProducersGroupEventParticipantModel = require("./ProducersGroupEventParticipant");
var Notification = require("./Notification");
var PaypalTransact = require("./PaypalTransact");
var Order = require("./Order");
var LigneOrder = require("./LigneOrder");
var Motif = require("./Motif");
var Dispute = require("./Dispute");
var DisputeLigneOrder = require("./DisputeLigneOrder");
var Report = require("./Report");
var Delivery = require("./Delivery");

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
    "ProducersGroupSubscriber": ProducersGroupSubscriberModel,
    "ProducersGroupEvent": ProducersGroupEventModel,
    "ProducersGroupEventParticipant": ProducersGroupEventParticipantModel,
    "Notification": Notification,
    "PaypalTransact": PaypalTransact,
    "Order": Order,
    "LigneOrder" : LigneOrder,
    "Motif" : Motif,
    "Dispute": Dispute,
    "DisputeLigneOrder": DisputeLigneOrder,
    "Report": Report,
    "Delivery": Delivery
};
