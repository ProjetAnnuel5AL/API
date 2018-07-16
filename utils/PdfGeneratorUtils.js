var PDFDocument = require("pdfkit");
var fs = require("fs");
const pdfInvoice = require('./PdfGeneratorEngineUtils');

var PDFBillUser = function(customer, items, producer, orderId, orderDate, res) {
    const document = pdfInvoice({
      company: {
        phone: '(+33) 106863729',
        email: 'lechampalamaison@gmail.com',
        address: '242 rue faubourg saint antoine',
        city: '75001, Paris, France',
        name: 'Le champ à la maison.',
      },
      customer: customer,
      items: items,
      producer: producer,
      orderId: orderId,
      orderDate : orderDate
    })
    document.generate()
    document.pdfkitDoc.pipe(res);
};

module.exports={
    "PDFBillUser" : PDFBillUser,
};