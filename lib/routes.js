const routes = require('express').Router();
const crawler = require('./crawler.js');
const processHTML = require('./processHTML');
const Log = require('../db/Models/Log.js');
const logAndRespond = require('./logAndRespond');
const sha256 = require('sha256');
const AndroidLog = require('../db/Models/AndroidLog.js');

const request = require('request').defaults({jar:true});
var cheerio = require('cheerio');

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


routes.post('/api/test', function (req, res) {
    request.post(
        {
            url:'https://my.qu.edu.az/loginAuth.php',
            form:{
                username: '140105023',
                password: 'c171617126m',
                LogIn: ' Daxil ol '
            }
        },function(error,response,body){
            // var $ = cheerio.load(body);
            //
            console.log(response);

            res.send(body);
        }
    );
});

routes.get('/test', function (req, res) {
    console.log('request for test');

    var responseData = {
        fromLogger: 'true'
    };

    logAndRespond(req,200,responseData,res);
});

routes.post('/api/getGrades', function (req, res) {
    console.log('request');

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
                html: data.html,
                responseStatusCode: 200,
                responseData: {
                    subjects: subjects,
                    semesterAverage: semesterAverage,
                    fullname: fullname
                }
            },res);
        })
        .catch(function(errData){
            // Send error response

            console.log('error - catch function');

            logAndRespond({
                req: req,
                html: errData.html,
                responseStatusCode: ( errData.statusCode || 500 ),
                responseData: {
                    error: ("messages" in errData) ? errData.messages[data.lang] : defaultErrorMessage
                }
            },res);
        })
});

routes.post('/api/getCourses', function (req, res) {
    console.log('request for getCourse');

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
                html: data.html,
                responseStatusCode: 200,
                responseData: {
                    courses: courses
                }
            },res);
        })
        .catch(function(errData){
            // Send error response

            console.log('error - catch function');

            console.log(data.html);

            logAndRespond({
                req: req,
                html: errData.html,
                responseStatusCode: ( errData.statusCode || 500 ),
                responseData: {
                    error: ("messages" in errData) ? errData.messages[data.lang] : defaultErrorMessage
                }
            },res);
        })
});

routes.post('/api/getAbsences', function (req, res) {
    console.log('request for getCourse');

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
                html: data.html,
                responseStatusCode: 200,
                responseData: {
                    absences: absences
                }
            },res);
        })
        .catch(function (errData) {
            // Send error response

            console.log('error - catch function');

            logAndRespond({
                req: req,
                html: errData.html,
                responseStatusCode: ( errData.statusCode || 500 ),
                responseData: {
                    error: ("messages" in errData) ? errData.messages[data.lang] : defaultErrorMessage
                }
            },res);
        });
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
