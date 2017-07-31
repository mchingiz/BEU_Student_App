const exec = require('child_process').exec;

const execute = function(command){
    var promise = new Promise(function(resolve,reject){
        exec(command, function(error, stdout, stderr){
            if(!error){
                resolve(stdout);
            }

            reject(error);
        });
    })

    return promise;
}

module.exports = {
    exec: execute
}