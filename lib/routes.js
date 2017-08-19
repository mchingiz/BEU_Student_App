const routes = require('express').Router();
const crawler = require('./crawler.js');
const crawler2 = require('./crawler2.js');
const crawler3 = require('./crawler3.js');
const processHTML = require('./processHTML');
const Log = require('../db/Models/log.js');
const logAndRespond = require('./logAndRespond');



routes.get('/', function (req, res) {
    // res.sendStatus(200);
    console.log('index');

    res.sendFile('public/index.html');
});

routes.get('/ping',function (req,res){
    res.status(200).send("up");
});

routes.get('/checkVersion',function(req,res){
    res.status(200).json({
        minimum: process.env.ANDROID_MINIMUM_V,
        latest: process.env.ANDROID_LATEST_V
    })
});
// -----------------
// ----  TEST  -----
// -----------------

routes.get('/test', function (req, res) {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    // Credentials will be checked on middleware depending on environment
    // userDetails property will be set on middleware
    // var data = req.userDetails;
    // data.lang = req.body.lang;

    data = {};

    data.username = "140105023";
    data.username = process.env.STUDENT_ID;
    data.password = process.env.STUDENT_PASSWORD;
    data.lang = "en";

    var promise =
        crawler2.visitWebsite(data)
        .then(crawler2.fillFormAndSubmit)
        .then(crawler2.checkForAnnouncement)
        .then(function(data){
            console.log(data.username)
            res.status(200).send(data.username);
        })
        .catch(function(errData){
            res.json(errData);
        })
});

routes.post('/getReq', function(req,res){
    console.log('getReq');
    res.json(req.ip);
});

routes.get('/showAllLogs', function (req, res) {
    Log.find({},function(err,logs){
        if(err) throw err;

        res.json(logs);
    })
});

routes.post('/api/getGrades', function (req, res) {
    console.log('request');

    // Can delete on production
    // res.header('Access-Control-Allow-Origin', 'http://beu-calculator.herokuapp.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    // Credentials will be checked on middleware depending on environment
    // userDetails property will be set on middleware
    var data = req.userDetails;
    data.lang = req.body.lang;

    var promise = crawler.visitWebsite(data)
        .then(crawler.fillFormAndSubmit)
        .then(crawler.checkForAnnouncement)
        .then(crawler.checkForWrongCredentials)
        .then(crawler.getGradesAsHTML)
        .then(crawler.getStudentDetails)
        .then(function(data){
            // Send success response

            console.log('All went well');

            var subjects = processHTML.getGrades(data.gradesTable);
            var semesterAverage = processHTML.getSemesterAverage(data.gradesTable);
            var fullname = data.studentFullname;

            logAndRespond({
                req: req,
                responseStatusCode: 200,
                responseData: {
                    subjects: subjects,
                    semesterAverage: semesterAverage,
                    fullname: fullname
                }
            },res);

            // res.status(200).json({
            //     subjects: subjects,
            //     semesterAverage: semesterAverage,
            //     fullname: fullname
            // })
        })
        .catch(function(errData){
            // Send error response

            console.log('error - catch function');

            var errMessage = data.lang == "az" ? errData.messages.az : errData.messages.en;

            logAndRespond({
                req: req,
                responseStatusCode: errData.statusCode,
                responseData: errMessage
            },res);

            // res.status(errData.statusCode)
            //     .json({
            //         error: errMessage
            //     });
        })
});

routes.post('/api/getCourses', function (req, res) {
    console.log('request for getCourse');

    // Can delete on production
    // res.header('Access-Control-Allow-Origin', 'http://beu-calculator.herokuapp.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    // Credentials will be checked on middleware depending on environment
    // userDetails property will be set on middleware
    var data = req.userDetails;
    data.lang = req.body.lang;

    var promise = crawler.visitWebsite(data)
        .then(crawler.fillFormAndSubmit)
        .then(crawler.checkForAnnouncement)
        .then(crawler.checkForWrongCredentials)
        .then(crawler.navigateToAttendance)
        .then(crawler.getCoursesAsHTML)
        .then(function(data){
            // Send success response

            console.log('All went well');

            var courses = processHTML.getCourses(data.coursesTable);

            logAndRespond({
                req: req,
                responseStatusCode: 200,
                responseData: {
                    courses: courses
                }
            },res);

            // res.status(200).json({
            //     courses: courses
            // })
        })
        .catch(function(errData){
            // Send error response

            console.log('error - catch function');

            var errMessage = data.lang == "az" ? errData.messages.az : errData.messages.en;

            logAndRespond({
                req: req,
                responseStatusCode: errData.statusCode,
                responseData: errMessage
            },res);

            // res.status(errData.statusCode)
            //     .json({
            //         error: errMessage
            //     });
        })
});

routes.post('/api/getAbsences', function (req, res) {
    console.log('request for getCourse');

    // Can delete on production
    // res.header('Access-Control-Allow-Origin', 'http://beu-calculator.herokuapp.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    // Credentials will be checked on middleware depending on environment
    // userDetails property will be set on middleware
    var data = req.userDetails;
    data.lang = req.body.lang;
    data.courseId = req.body.courseId;


    var promise = crawler.visitWebsite(data)
        .then(crawler.fillFormAndSubmit)
        .then(crawler.checkForAnnouncement)
        .then(crawler.checkForWrongCredentials)
        .then(crawler.navigateToAttendance)
        .then(crawler.navigateToAttendanceForSubject)
        .then(crawler.getAbsencesAsHTML)
        .then(function (data) {
            // Send success response

            console.log('All went well');

            var absences = processHTML.getAbsences(data.absencesTable);

            logAndRespond({
                req: req,
                responseStatusCode: 200,
                responseData: {
                    absences: absences
                }
            },res);

            // res.status(200).json({
            //     absences: absences
            // })
        })
        .catch(function (errData) {
            // Send error response

            console.log('error - catch function');

            var errMessage = data.lang == "az" ? errData.messages.az : errData.messages.en;

            logAndRespond({
                req: req,
                responseStatusCode: errData.statusCode,
                responseData: errMessage
            },res);

            // res.status(errData.statusCode)
            //     .json({
            //         error: errMessage
            //     });
        });
});

routes.all('*',function(req,res){
    res.status(404).send("404 Not found");
});

module.exports = routes;
