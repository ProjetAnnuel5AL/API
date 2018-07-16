'use strict';

var pdfKit = require('pdfkit');
var moment = require('moment');
var numeral = require('numeral');

var FR = {
    createdAt: 'Créé le',
    amount: 'Total',
    unitPrice: 'Prix unitaire',
    chargeStatus: 'Status de paiement',
    chargeFor: 'Client: ',
    thanks: 'Merci pour votre commande!',
    refundInfo: 'Vous disposez d\'un délai de rétractation de 15 jours après l\'achat. \nAfin d\'obtenir votre rembrousement, une demande peut-être effectuée sur lechampalamaison.fr dans\nVos commandes - détail de la commande - signaler un problème.',
    producer: 'Producteur:',
    order: 'Commande',
    description: 'Description',
    name: 'Nom',
    quantity: 'Quantité'
  };

var TEXT_SIZE = 8;
var TEXT_SIZE_MD = 10;
var TEXT_SIZE_LG = 12;
var CONTENT_LEFT_PADDING = 50;
var CONTENT_RIGHT_PADDING = 490;

function PDFInvoice(_ref) {
  console.log(_ref);
  var company = _ref.company;
  var producer = _ref.producer;
  var customer = _ref.customer;
  var items = _ref.items;
  var orderId = _ref.orderId;
  var orderDate = _ref.orderDate
  console.log(orderDate);
  var charge = {
    createdAt: orderDate.getDate() + '/' + orderDate.getMonth() + '/' + orderDate.getFullYear(),
    amount: items.reduce(function (acc, item) {
      return acc + item.amount;
    }, 0)
  };
  var doc = new pdfKit({ size: 'A4', margin: 50 });

  doc.fillColor('#333333');

  var translate = FR;
  moment.locale(PDFInvoice.lang);

  var divMaxWidth = 550;
  var table = {
    x: CONTENT_LEFT_PADDING,
    y: 350,
    inc: 110
  };

  return {
    genHeader: function genHeader() {
      doc.fontSize(20).text(company.name, CONTENT_LEFT_PADDING, 50);

      var borderOffset = doc.currentLineHeight() + 70;

      doc.fontSize(16).fillColor('#AAAAAA').text(moment(orderDate).format('dddd DD MMMM YYYY'), CONTENT_LEFT_PADDING, 50, {
        align: 'right'
      }).fillColor('#333333');

      doc.strokeColor('#cccccc').moveTo(CONTENT_LEFT_PADDING, borderOffset).lineTo(divMaxWidth, borderOffset);
    },
    genLogo: function genLogo() {
      doc.image('ressources/logochampmaison.png', 210, 150, {width: 170})
    },
    genInfos: function genInfos(){
      doc.fontSize(TEXT_SIZE_LG).fillColor('#FF851B').text(translate.thanks, 220, 250);
      doc.fontSize(TEXT_SIZE_MD).fillColor('#AAAAAA').text(translate.refundInfo, CONTENT_LEFT_PADDING, 270, {align: 'center'}).fillColor('black');
    },
    genFooter: function genFooter() {
      doc.fillColor('#AAAAAA');

      doc.fontSize(TEXT_SIZE_LG).text(company.name, CONTENT_LEFT_PADDING, 720);

      doc.text(company.address);
      doc.text(company.city);
      doc.text(company.phone);
      doc.text(company.email);

      doc.fillColor('#333333');
    },
    genCustomerInfos: function genCustomerInfos() {
      doc.fontSize(TEXT_SIZE_MD).fillColor('#AAAAAA').text(translate.chargeFor, CONTENT_LEFT_PADDING, 95);

      doc.text(customer.name + ' <' + customer.email + '>');
      doc.text(translate.order+' #' + orderId, CONTENT_RIGHT_PADDING, 95);
      
    },
    genProducerInfos: function genProducerInfos() {
      doc.fontSize(TEXT_SIZE_LG).fillColor('#AAAAAA').text(translate.producer, CONTENT_LEFT_PADDING, 730, {align: 'right'});

      doc.text(producer.name, {align: 'right'});
      doc.text(producer.address, {align: 'right'});
      doc.text(producer.city, {align: 'right'});
    },
    genTableHeaders: function genTableHeaders() {
      ['amount', 'name', 'description', 'unitPrice', 'quantity'].forEach(function (text, i) {
        doc.fontSize(TEXT_SIZE).text(translate[text], table.x + i * table.inc, table.y);
      });
    },
    genTableRow: function genTableRow() {
      items.map(function (item) {
        return Object.assign({}, item, {
          amount: numeral(item.amount).format('0,00.00')+'€',
          unitPrice : numeral(item.amount).format('0,00.00')+'€'
        });
      }).forEach(function (item, itemIndex) {
        ['amount', 'name', 'description','unitPrice','quantity'].forEach(function (field, i) {
          doc.fontSize(TEXT_SIZE).text(item[field], table.x + i * table.inc, table.y + TEXT_SIZE + 6 + itemIndex * 20);
        });
      });
    },
    genTableLines: function genTableLines() {
      var offset = doc.currentLineHeight() + 2;
      doc.moveTo(table.x, table.y + offset).lineTo(divMaxWidth, table.y + offset).stroke();
    },
    generate: function generate() {
      this.genHeader();
      this.genLogo();
      this.genInfos();
      this.genTableHeaders();
      this.genTableLines();
      this.genTableRow();
      this.genCustomerInfos();
      this.genProducerInfos();
      this.genFooter();

      doc.end();
    },


    get pdfkitDoc() {
      return doc;
    }
  };
}

PDFInvoice.lang = 'fr_FR';

module.exports = PDFInvoice;