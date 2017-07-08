require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const Browser = require('zombie');
const app = express();
const winston = require('winston'); // logger

// --------- PACKAGE SETTINGS ---------

Browser.waitDuration = '30s';
app.use(express.static('public'));
app.set('port', 3000);

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// --------- LOGGING -------

var offset = +4;

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

logger.info('PROCESS RESTARTED');

// --------- FUNCTIONALITY ---------

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

app.get('/', function (req, res) {
    console.log('index');

    res.sendFile(__dirname + '/index.html');
});

app.post('/getData', function (req, res) {
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

    var promise = visitWebsite(userDetails)
        .then(fillFormAndSubmit)
        .then(checkForAnnouncement)
        .then(checkForWrongCredentials)
        .then(getGradesAsHTML)
        .then(getStudentDetails);

    promise
        .then(function(data){
            console.log('All went well');
            sendResponse(data,res);
        })
        .catch(function(errData){
            console.log('error - catch function');
            // console.log(errData);

            var errMessage = userDetails.lang == "az" ? errData.messages.az : errData.messages.en;

            res
                .status(errData.statusCode)
                .json({
                    error: errMessage
                });
        })
});

var visitWebsite = function(userDetails){
    console.log('visit website');
    console.log(userDetails);

    var promise = new Promise(function(resolve,reject){
        Browser.visit('https://my.qu.edu.az',function(err,browser){
            if(err){
                console.log("sayta gire bilmedik");

                reject({
                    statusCode: 500,
                    messages: {
                        az: "Sayta gire bilmedik",
                        en: "Couldn't enter the site"
                    }
                })
            }

            // Below object will be passed down the promise chain,
            // so every promise has access to below properties.
            var data = {
                browser: browser,
                username: userDetails.username,
                password: userDetails.password,
                lang: userDetails.lang
            };

            console.log('sayta gire bildik');
            resolve(data);
        });
    });

    return promise;
};

var fillFormAndSubmit = function(data){
    var promise = new Promise(function(resolve,reject){
        data.browser
            .fill('input[name=username]',data.username)
            .fill('input[name=password]',data.password)
            .pressButton('input[name=LogIn]',function(err){
                if(err){
                    console.log('error on pressing login');

                    reject({
                        statusCode: 500,
                        message: {
                            az: "Hesaba giremmedik",
                            en: "Couldn't log in"
                        }
                    });
                }

                console.log('login eledik');
                resolve(data);
            })
    });

    return promise;
};

var checkForAnnouncement = function(data){

    var promise = new Promise(function(resolve,reject){
        if(data.browser.location.href == 'https://my.qu.edu.az/announcement.php'){
            console.log('announcement');

            data.browser.pressButton('input[name=btnOxudum]',function(err){
                if(err){
                    console.log("Elani kece bilmedik");

                    reject({
                        statusCode: 500,
                        messages: {
                            az: "Elani kece bilmedik",
                            en: "Couldn't pass by announcement"
                        }
                    })
                }

            })
        }

        data.browser.wait().then(function(){
            console.log('announcement yoxdu');
            resolve(data);
        })

    });

    return promise;
};

var checkForWrongCredentials = function(data){
    console.log('parol ve usernamei yoxlayir');

    var promise = new Promise(function(resolve,reject){
        console.log('in promise');

        // browser.assert.element('#main');

        if(data.browser.querySelector("input[name=username]")){
            console.log('parol ya username sehvdi');

            reject({
                statusCode: 400,
                messages: {
                    az: "Parol zad sehvdi",
                    en: "Credentials are wrong"
                }
            })
        }

        console.log('parol username duzdu');
        resolve(data);
    });

    return promise;
};

var getGradesAsHTML = function(data){
    console.log('Qiymet cedvelini goturur');

    var promise = new Promise(function(resolve,reject){
        data.browser.wait().then(function(err){
            data.browser.location = "?mod=grades";
            data.browser.wait().then(function(err){
                // console.log(browser.query())
                // console.log(browser.document.documentElement.innerHTML);

                if(err){
                    reject({
                        statusCode: 500,
                        messages: {
                            az: "Qiymetleri goturerken problem yarandi",
                            en: "There was a problem when we tried to get grades"
                        }
                    })
                }

                data.gradesTable = data.browser.querySelectorAll('#divShowStudGrades table tbody tr');

                console.log('Qiymet cedvelini goturdu');
                resolve(data);
            })
        })
    });

    return promise;
};

var getStudentDetails = function(data){
    var promise = new Promise(function(resolve,reject){
        data.studentFullname = data.browser.querySelectorAll(".clsTbl tbody tr td")[1].innerHTML.trim();

        resolve(data);
    });

    return promise;
};

function sendResponse(data,res){
    // res.sendStatus(200);
    var subjects = getGrades(data.gradesTable);
    var semesterAverage = getSemesterAverage(data.gradesTable);
    var fullname = data.studentFullname;

    console.log(fullname);

    res.status(200).json({
        subjects: subjects,
        semesterAverage: semesterAverage,
        fullname: fullname
    })
}

function getGrades(gradesTable){
    var subjects = [];

    for(var i=2;i<gradesTable.length-1;i++){
        var subject = {};

        subject.code = gradesTable[i].querySelectorAll('td')[0].innerHTML;
        subject.name = gradesTable[i].querySelectorAll('td')[3].innerHTML;
        subject.ects = gradesTable[i].querySelectorAll('td')[4].innerHTML.trim();
        subject.abs = gradesTable[i].querySelectorAll('td')[5].innerHTML.trim();
        subject.sdf1 = gradesTable[i].querySelectorAll('td')[6].innerHTML.trim();
        subject.sdf2 = gradesTable[i].querySelectorAll('td')[7].innerHTML.trim();
        subject.sdf3 = gradesTable[i].querySelectorAll('td')[8].innerHTML.trim();
        subject.ff = gradesTable[i].querySelectorAll('td')[9].innerHTML.trim();
        subject.dvm = gradesTable[i].querySelectorAll('td')[10].innerHTML.trim();
        subject.fnl = gradesTable[i].querySelectorAll('td')[11].innerHTML.trim();
        subject.avg = gradesTable[i].querySelectorAll('td')[14].innerHTML.trim().replace("&nbsp;","");

        // console.log('name: '+subject.name);
        // console.log('sdf1: '+subject.sdf1);

        subjects[i-2] = subject;
    }


    console.log('------------');

    return subjects;
}

function getSemesterAverage(gradesTable){
    return gradesTable[gradesTable.length-1].querySelector('td:last-child').innerHTML.replace(/<\/?[^>]+(>|$)/g, ""); // To delete any inner htlm tag
}