require('dotenv').config();

const request = require('request');
const xoauth2 = require('xoauth2');
const ipAddress = require('./lib/ip');
var mailer = require('./lib/mailer')

var serverIsUp = true;

// Request

const reqUrl = "http://"+ipAddress+":3000/ping";

const callback = function(err,res,body){
    if(!err && res.statusCode == 200){ // Works well
        serverIsUp = true;
        console.log('up');
    }else if(serverIsUp == true){ // Should notify
        console.log('notify');

        mailer.sendMail()
            .then(function(){
                serverIsUp = false;
            })
            .catch(function(){

            })
    }else{ // Notified already
        console.log('notified already')
    }
}


setInterval(function(){
    request.get("http://"+ipAddress+":3000/ping", callback);
},3*1000);