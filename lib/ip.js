const publicIp = require('public-ip');

function getIp(){
    if(process.env.ENV == "pro"){
        return publicIp.v4().then(function(ip){
            console.log(ip);
            return ip;
        });
    }else if(process.env.ENV == "dev"){
        return "localhost";
    }
}

module.exports = {
    get: function(){
        function getIp(){
            if(process.env.ENV == "pro"){
                return publicIp.v4().then(function(ip){
                    console.log(ip);
                    return ip;
                });
            }else if(process.env.ENV == "dev"){
                return "localhost";
            }
        };
    }
}
