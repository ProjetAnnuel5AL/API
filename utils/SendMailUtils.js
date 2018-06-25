var nodemailer = require('nodemailer');

var SendMailUtils=function(){
	this.from = "azanlo2018@gmail.com"
	this.transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'azanlo2018@gmail.com',
			pass: 'De9Dph68'
		},
		tls: {
			rejectUnauthorized: false
		}
	});

};

SendMailUtils.prototype.sendMail = function(to, subject, text) {

	var mailOptions = {
		from: this.from,
		to: to,
		subject: subject,
		text: text
	};
  this.transporter.sendMail(mailOptions, function(error, info){
	if (error) {
		console.log("ERREUR ENVOI MAIL")
          console.log(error);
	} else {
	  console.log('Email sent: ' + info.response);
	}
  });
};


module.exports=SendMailUtils;
