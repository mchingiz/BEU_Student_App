var ipAddress;
const publicIp = require('public-ip');

if(process.env.ENV == "pro"){
    ipAddress = publicIp.v4().then(function(ip){
        console.log(ip);
        return ip;
    });
}else if(process.env.ENV == "dev"){
    ipAddress = "localhost";
}

module.exports = "localhost";