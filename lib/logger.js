const winston = require('winston'); // logger

const offset = +4;

function timestampFormatter(){
    var dt = new Date( new Date().getTime()+offset*3600*1000 );

    return timestamp =
        (dt.getMonth() + 1) + "/" +
        dt.getDate() + "/" +
        dt.getFullYear() + " " +
        dt.getHours() + ":" +
        dt.getMinutes() + ":" +
        dt.getSeconds() + ":" +
        dt.getMilliseconds();
}

var logger = new (winston.Logger)({
    transports: [
        new winston.transports.File({
            filename: 'logs/students.log',
            level: 'info',
            json: false,
            timestamp: timestampFormatter,
            formatter: function(options){
                var log = "";

                log += '(' + options.level + ') ' + options.timestamp() + ' || ' + (options.message ? options.message : '');

                // log += "\n------------------------------------";

                return log;
            }
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: 'logs/unhandledExceptions.log',
            json: false,
            timestamp: timestampFormatter,
            formatter: function(options){
                var log = "";

                log += options.level.toUpperCase() + ' || ' + options.timestamp() + '\n\t' + (options.message ? options.message : '');

                if(options.meta && Object.keys(options.meta).length){
                    var stack = options.meta.stack;
                    for(var i=0;i<stack.length;i++){
                        log += stack[i]+'\n';
                    }
                }

                log += "------------------------------";

                return log;
            }
        })
    ],
    exitOnError: false
});

module.exports = logger;