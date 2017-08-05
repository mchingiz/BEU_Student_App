const router = require('express').Router();
const extend = require('util')._extend;
const Log = require('../db/Models/log.js');

const logAndSendResponse = function(logData,res){
    console.log('gonna log and send repsonse');

    var log = new Log({
        req: {
            body: logData.req.body,
            ip: logData.req.ip
        },
        res: {
            statusCode: logData.responseStatusCode,
            data: extend({},logData.responseData) // To pass by value, not reference
        }
    });

    // Delete sensitive data from log
    delete log.req.body.password;
    delete log.res.data.fullname;
    delete log.req.body.key;

    console.log(logData.responseData.fullname);

    if( logData.responseData.courses ){ // Then delete teachers' name
        log.res.data.courses.forEach(function(course){
            delete course.teacher;
        })
    }


    // Save log
    log.save(function(err){
        if (err){
            console.error("log couldn't be saved");
	    console.error(err);
        }else{
            console.log('created log');

        }

        if(logData.responseStatusCode == 200){
            res.status(logData.responseStatusCode).json(logData.responseData);
        }else{
            res.status(logData.responseStatusCode).json({
                error: logData.responseData
            });
        }

    });
};

module.exports = logAndSendResponse;
