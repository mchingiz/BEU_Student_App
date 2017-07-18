const router = require('express').Router();
const Log = require('../db/Models/log.js');

const logAndSendResponse = function(req,res,statusCode,responseData){
    console.log('gonna log and send repsonse');
    console.log(req.body.username);

    var log = new Log({
        reqParams: {
            studentId: req.body.username,
            lang: req.body.lang
        },
        statusCode: statusCode,
        res: responseData
    });

    log.save(function(err){
        if (err) throw err;

        console.log('created log');

        res.status(statusCode).json(responseData);
    });
};

module.exports = logAndSendResponse;