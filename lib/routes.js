const routes = require('express').Router();
const crawler = require('./crawler.js');
const processHTML = require('./processHTML');

routes.get('/', function (req, res) {
    console.log('index');

    res.sendFile(__dirname + '/index.html');
});

routes.post('/api/getGrades', function (req, res) {
    console.log('request');

    // Can delete on production
    // res.header('Access-Control-Allow-Origin', 'http://beu-calculator.herokuapp.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    console.log('Environment: '+process.env.ENV);

    var userDetails = {};

    if(process.env.ENV == "pro"){
        userDetails.username = req.body.username;
        userDetails.password = req.body.password;
    }else if(process.env.ENV == "dev"){
        userDetails.username = process.env.STUDENT_ID;
        userDetails.password = process.env.STUDENT_PASSWORD;
    }

    userDetails.lang = req.body.lang;

    var promise = crawler.visitWebsite(userDetails)
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

            res.status(200).json({
                subjects: subjects,
                semesterAverage: semesterAverage,
                fullname: fullname
            })
        })
        .catch(function(errData){
            // Send error response

            console.log('error - catch function');

            var errMessage = userDetails.lang == "az" ? errData.messages.az : errData.messages.en;

            res.status(errData.statusCode)
                .json({
                    error: errMessage
                });
        })
});

module.exports = routes;