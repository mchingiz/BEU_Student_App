const router = require('express').Router();
const extend = require('util')._extend;
const Log = require('../db/Models/Log.js');

const logAndSendResponse = function(data,responseObject){
    console.log('gonna log and send repsonse');

    var log = new Log({
        req: {
            body: data.req.body,
            ip: data.req.ip
        },
        html: data.html,
        res: {
            statusCode: data.responseStatusCode,
            data: extend({},data.responseData) // To pass by value, not reference
        }
    });

    if("errorStack" in data){
        log.errorStack = data.errorStack;
    }

    // Delete sensitive data from log
    deleteSensitiveData(log,data);

    // Save log
    log.save(function(err){
        if (err){
            console.error("log couldn't be saved");
	        console.error(err);
        }else{
            console.log('created log');
        }
    });

    responseObject.status(data.responseStatusCode).json(data.responseData);

    function deleteSensitiveData(log,data){
        delete log.req.body.password;
        delete log.res.data.fullname;
        delete log.req.body.key;

        if( data.responseData.courses ){ // Then delete teachers' name
            log.res.data.courses.forEach(function(course){
                delete course.teacher;
            })
        }
    };
};

module.exports = logAndSendResponse;
