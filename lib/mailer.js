// https://medium.com/@pandeysoni/nodemailer-service-in-node-js-using-smtp-and-xoauth2-7c638a39a37e

const nodemailer = require('nodemailer');

const smtpTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        type: 'Oauth2',
        user: process.env.MAIL_USER,
        clientId: process.env.MAIL_CLIENT_ID,
        clientSecret: process.env.MAIL_CLIENT_SECRET,
        refreshToken: process.env.MAIL_REFRESH_TOKEN,
    }
});

const mailOptions = {
    from: 'memmedlicngz@gmail.com',
    to: 'memmedlicngz@gmail.com',
    subject: 'Server is down',
};

const sendMail = function(content){
    var promise = new Promise(function(resolve,reject){

        mailOptions.html = content;

        smtpTransporter.sendMail(mailOptions,function(err,info){
            if(err){
                console.log('error on sendMail');
                console.log(err);
                reject();
            }else{
                console.log('Mail sent successfully');
                resolve();
            }

            console.log("-".repeat(20));

            smtpTransporter.close();
        })
    });

    return promise;
}

module.exports = {
    sendMail: sendMail
}
