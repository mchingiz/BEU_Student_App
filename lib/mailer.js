const nodemailer = require('nodemailer');
const util = require('util');
var ipAddress = require('./ip');

const timestampFormatter = function(timeOffset = 0){
    var dt = new Date( new Date().getTime()+timeOffset*3600*1000 );

    return timestamp =
        (dt.getMonth() + 1) + "/" +
        dt.getDate() + "/" +
        dt.getFullYear() + " " +
        dt.getHours() + ":" +
        dt.getMinutes() + ":" +
        dt.getSeconds();
};

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

// const mailBody = 'Server was down at <b>'+timestampFormatter()+'</b>. <a href="http://'+ipAddress+':3000/ping">Check again</a>';
var mailBody = util.format("Server was down at %s. <a href='http://%s:3000/ping'>Check again</a>.", timestampFormatter(), ipAddress);
mailBody = mailBody + "\n Here is last 20 lines of error logs.";

// console.log(mailBody);
const mailOptions = {
    from: 'memmedlicngz@gmail.com',
    to: 'memmedlicngz@gmail.com',
    subject: 'Server is down',
    html: mailBody,
};

const sendMail = function(){
    var promise = new Promise(function(resolve,reject){

        mailOptions.text = ""

        smtpTransporter.sendMail(mailOptions,function(err,info){
            if(err){
                console.log('error on sendMail');
                console.log(err);
                reject();
            }else{
                console.log('Mail sent successfully');
                console.log(info);
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
