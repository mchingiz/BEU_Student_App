const ip = require('./ip');

ip.get().then(function(ip){
    console.log(ip);
});