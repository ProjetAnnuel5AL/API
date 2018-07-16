var PDFDocument = require("pdfkit");
var fs = require("fs");
const pdfInvoice = require('./PdfGeneratorEngineUtils');

var PDFBillUser = function(customer, items, producer, orderId, orderDate, totalPrice, res) {
    const document = pdfInvoice({
      company: {
        phone: '(+33) 7-83-70-66-82',
        email: 'lechampalamaison@gmail.com',
        address: '242 rue du faubourg saint antoine',
        city: '75012, Paris, France',
        name: 'Le champ à la maison.',
      },
      customer: customer,
      items: items,
      producer: producer,
      orderId: orderId,
      orderDate : orderDate,
      totalPrice : totalPrice
    })
    document.generate()
    document.pdfkitDoc.pipe(res);
};

module.exports={
    "PDFBillUser" : PDFBillUser,
};