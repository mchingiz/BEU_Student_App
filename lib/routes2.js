const routes = require('express').Router();
const crawler = require('./crawler.js');
// const processHTML = require('./processHTML');
const processHTML = require('./processHTML2');
const Log = require('../db/Models/Log.js');
const logAndRespond = require('./logAndRespond');
const sha256 = require('sha256');
const AndroidLog = require('../db/Models/AndroidLog.js');

const scraper = require('./test.js');

var defaultErrorMessage = "Something bad has happened. We are trying to figure it out.";

routes.get('/ping',function (req,res){
    res.status(200).send("up");
});

routes.get('/checkVersion',function(req,res){
    res.status(200).json({
        minimum: process.env.ANDROID_MINIMUM_V,
        latest: process.env.ANDROID_LATEST_V,
        maintenance: process.env.ANDROID_MAINTENANCE
    })
});

// -----------------
// ----  TEST  -----
// -----------------


routes.post('/api/getGrades', function (req, res) {
    var data = {};

    data.username = req.body.username;
    data.password = req.body.password;
    data.lang = req.body.lang;

    var promise = scraper.login(data)
        .then(scraper.getGrades)
        .then(function(data){
            res.send(processHTML.getGrades(data.gradesTable));
        })
        .catch(function(err) {
            console.log(err)
        })
});

routes.post('/api/getCourses', function (req, res) {
    var data = {};

    data.username = req.body.username;
    data.password = req.body.password;
    data.lang = req.body.lang;

    var promise = scraper.login(data)
        .then(scraper.getCourses)
        .then(function(data){
            res.send(processHTML.getCourses(data.coursesTable));
        })
        .catch(function(err) {
            console.log(err)
        })
});

routes.post('/api/getAbsences', function (req, res) {
    var data = {};

    data.username = req.body.username;
    data.password = req.body.password;
    data.courseId = req.body.courseId;
    data.lang = req.body.lang;

    var promise = scraper.login(data)
        .then(scraper.getAbsences)
        .then(function(data){
            res.send(processHTML.getAbsences(data.absencesTable));
        })
        .catch(function(err) {
            console.log(err)
        })
});

routes.get('/test', function (req, res) {
    console.log('request for test');

    var responseData = {
        fromLogger: 'true'
    };

    logAndRespond(req,200,responseData,res);
});

routes.post('/api/putLog', function(req,res){
    delete req.body.key;

    var androidLog = new AndroidLog(req.body);

    androidLog.save(function(err){
        if(err){
            console.error("Couldn't save androidLog. Error message is below");
            console.error(err);
        }

        res.sendStatus(200);
    })
});

routes.all('*',function(req,res){
    res.status(404).send("404 Not found");
});

module.exports = routes;
