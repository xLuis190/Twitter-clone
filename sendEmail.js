var nodemailer = require('nodemailer')
class Email {
    constructor() {
        this.myEmail = 'xluis1749@gmail.com'
        this.password = 'Hello123*@'
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.myEmail,
                pass: this.password
            }
        });
    }
    sendEmail(to) {
        var mailOptions = {
            from: this.myEmail,
            to: to,
            subject: 'Verification Code',
            text: emailTemplate
        };
        this.transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}
mail = new Email()
mail.sendEmail("xLuis190@hotmail.com")