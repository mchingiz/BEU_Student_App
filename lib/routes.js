const routes = require('express').Router();
const processHTML = require('./processHTML');
const Log = require('../db/Models/Log.js');
const logAndRespond = require('./logAndRespond');
const sha256 = require('sha256');
const AndroidLog = require('../db/Models/AndroidLog.js');
const FileDb = require('../db/FileBased.js');

const scraper = require('./scraper.js');
const request = require('request');

var defaultErrorMessage = "Something broke! We are working on it.";

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
	console.log("get grades - "+req.body.username);

    data.username = req.body.username;
    data.password = req.body.password;
    data.lang = req.body.lang;
    data.cookieJar = request.jar();
    data.html = {};
    data.startedAt = (new Date).getTime();

    var promise = scraper.login(data)
        .then(scraper.getGrades)
        .then(function(data){
        console.log("got grades")
        
        FileDb.append("requests",req.body.username);

            logAndRespond({
                req: req,
                html: data.html,
                responseStatusCode: 200,
                responseData: {
                    notice: "Bizə dəstək olmaq istəyirsiniz? O zaman ara-sıra reklamlara click-ləməyi unutmayın.",
                    noticeSeq: 23,
                    subjects: processHTML.getGrades(data.html.gradesTable),
                    semesterAverage: processHTML.getSemesterAverage(data.html.gradesTable),
                    fullname: processHTML.getStudentFullname(data.html.homepage)
                },
                responseTime: (new Date).getTime()-data.startedAt
            },res);
        })
        .catch(function(err) {
            console.error(err);

            logAndRespond({
                req: req,
                html: err.html,
                responseStatusCode: ( err.statusCode || 500 ),
                responseData: {
                    error: ("messages" in err) ? err.messages[data.lang] : defaultErrorMessage
                },
                responseTime: (new Date).getTime()-data.startedAt
            },res);
        })
});

routes.post('/api/getCourses', function (req, res) {
    var data = {};

    data.username = req.body.username;
    data.password = req.body.password;
    data.lang = req.body.lang;
    data.cookieJar = request.jar();
    data.html = {};
    data.startedAt = (new Date).getTime();

    var promise = scraper.login(data)
        .then(scraper.getCourses)
        .then(function(data){
            logAndRespond({
                req: req,
                html: data.html,
                responseStatusCode: 200,
                responseData: {
                    courses: processHTML.getCourses(data.html.coursesTable)
                },
                responseTime: (new Date).getTime()-data.startedAt
            },res);
        })
        .catch(function(err) {
            console.error(err);

            logAndRespond({
                req: req,
                html: err.html,
                responseStatusCode: ( err.statusCode || 500 ),
                responseData: {
                    error: ("messages" in err) ? err.messages[data.lang] : defaultErrorMessage
                },
                responseTime: (new Date).getTime()-data.startedAt
            },res);
        })
});

routes.post('/api/getAbsences', function (req, res) {
    var data = {};

    data.username = req.body.username;
    data.password = req.body.password;
    data.courseId = req.body.courseId;
    data.lang = req.body.lang;
    data.cookieJar = request.jar();
    data.html = {};
    data.startedAt = (new Date).getTime();

    var promise = scraper.login(data)
        .then(scraper.getAbsences)
        .then(function(data){
            logAndRespond({
                req: req,
                html: data.html,
                responseStatusCode: 200,
                responseData: {
                    absences: processHTML.getAbsences(data.html.absencesTable)
                },
                responseTime: (new Date).getTime()-data.startedAt
            },res);
        })
        .catch(function(err) {
            console.error(err);

            logAndRespond({
                req: req,
                html: err.html,
                responseStatusCode: ( err.statusCode || 500 ),
                responseData: {
                    error: ("messages" in err) ? err.messages[data.lang] : defaultErrorMessage
                },
                responseTime: (new Date).getTime()-data.startedAt
            },res);
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

// To respond all request even if an error occurs
routes.use(function (err, req, res, next) {
    console.error(err.stack);

    logAndRespond({
        req: req,
        html: err.html,
        responseStatusCode: ( err.statusCode || 500 ),
        responseData: {
            error: defaultErrorMessage
        },
        errorStack: err.stack
    },res);
});

module.exports = routes;
