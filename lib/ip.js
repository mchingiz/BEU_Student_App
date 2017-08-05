const publicIp = require('public-ip');

module.exports = {
    get: function(){
        var promise = new Promise(function(resolve,reject){
            if(process.env.ENV == "pro"){
                publicIp.v4()
                    .then(function(ip){
                        resolve(ip)
                    })
                    .catch(function(err){
                        console.err("COULDN'T GET IP ADDRESS");
                        throw err;
                    });
            }else if(process.env.ENV == "dev"){
                resolve("localhost");
            }
        })

        return promise;
    }
};