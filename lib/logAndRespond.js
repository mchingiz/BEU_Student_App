const router = require('express').Router();
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
            data: logData.responseData
        }
    });

    // Delete sensitive data from log
    delete log.req.body.password;
    delete log.res.data.fullname;

    if( logData.responseData.courses ){ // Then delete teachers' name
        log.res.data.courses.forEach(function(course){
            delete course.teacher;
        })
    }


    // Save log
    log.save(function(err){
        if (err){
            console.error("log couldn't be saved");
        }else{
            console.log('created log');

            res.status(logData.responseStatusCode).json(log);
        }
    });
};

module.exports = logAndSendResponse;