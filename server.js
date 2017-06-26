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
    res.header('Access-Control-Allow-Origin', 'http://beu-calculator.herokuapp.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    var username = req.body.username;
    var password = req.body.password;
    var lang = req.body.lang;

    var result = checkAndGetData(username,password,lang,function(result){
        res.json(result);

        console.log("sent");
    });

    console.log('sending');
});

function checkAndGetData(username,password,lang,sendResponseCallback){
    var data = {};

    Browser.visit('https://my.qu.edu.az',function(e,browser){
        // console.log(browser.document.documentElement.innerHTML);

        console.log('requested homepage / '+username+' / '+password);
        console.log('in page');

        browser.fill('input[name=username]',username)
            .fill('input[name=password]',password)
            .pressButton('input[name=LogIn]',function(err){
                if(err){
                    console.log('error on pressing login');

                    data.statusCode = 500;
                    if(lang == "az"){
                        data.error = "Hesaba giriş edə bilmədik, zəhmət olmasa təkrar 'daxil ol' düyməsini basın";
                    }else if(lang == en){
                        data.error = "Something went wrong. Please try again by click 'login'"
                    }

                    sendResponseCallback(data);
                }else{
                    console.log('logged in succesfully');
                }
            })

        // browser.document.forms[0].submit();

        browser.wait().then(function(){
            if(browser.location.href == 'https://my.qu.edu.az/announcement.php'){
                console.log('announcement');


                browser.pressButton('input[name=btnOxudum]',function(err){
                    if(err){

                        data.statusCode = 500;
                        if(lang == "az"){
                            data.error = "Qiymətləri götürərkən problem yarandı, zəhmət olmasa təkrar 'hesabla' düyməsini bas";
                        }else if(lang == "en"){
                            data.error = "Something went wrong when we tried to get your grades. Please try again by click 'login'";
                        }

                        console.log("Qiymətləri götürərkən problem yarandı, zəhmət olmasa təkrar 'hesabla' düyməsini bas");

                        sendResponseCallback(data);
                    }else{
                        console.log('Passed by announcement successfully');
                    }
                })

                getGrades(browser,sendResponseCallback);
            }else{
                console.log("no announcement");

                if(browser.querySelector("input[name=username]")){
                    console.log("wrong credentials");

                    data.statusCode = 400;

                    if(lang == "az"){
                        data.error = "Girdiyin tələbə nömrəsi və ya parol səhvdir, zəhmət olmasa düzgün versiyalarını yazıb, bir daha yoxla";
                    }else if(lang == "en"){
                        data.error = "Credentials you have entered are wrong. Please correct them and try again";
                    }

                    sendResponseCallback(data);

                    return;
                }

                logger.info(" student_id: %s", username);

                getGrades(browser,sendResponseCallback);
            }
        })
    });
}

function getGrades(browser,sendResponseCallback){
    browser.wait().then(function(){
        browser.location = "?mod=grades";
        browser.wait().then(function(){
            data = {};
            data.statusCode = 200;

            // console.log(browser.query())
            // console.log(browser.document.documentElement.innerHTML);


            var subjectsHTML = browser.querySelectorAll('#divShowStudGrades table tbody tr');
            // var gradesList = browser.html('#divShowStudGrades');

            data.subjects = createSubjectsArray(subjectsHTML);

            // printStudentGrades(data);

            sendResponseCallback(data);
        })
    })
}

function createSubjectsArray(subjectsHTML){
    var subjects = [];

    for(var i=2;i<subjectsHTML.length-1;i++){
        var subject = {}

        subject.code = subjectsHTML[i].querySelectorAll('td')[0].innerHTML;
        subject.name = subjectsHTML[i].querySelectorAll('td')[3].innerHTML;
        subject.ects = subjectsHTML[i].querySelectorAll('td')[4].innerHTML.trim();
        subject.abs = subjectsHTML[i].querySelectorAll('td')[5].innerHTML.trim();
        subject.sdf1 = subjectsHTML[i].querySelectorAll('td')[6].innerHTML.trim();
        subject.sdf2 = subjectsHTML[i].querySelectorAll('td')[7].innerHTML.trim();
        subject.sdf3 = subjectsHTML[i].querySelectorAll('td')[8].innerHTML.trim();
        subject.ff = subjectsHTML[i].querySelectorAll('td')[9].innerHTML.trim();
        subject.dvm = subjectsHTML[i].querySelectorAll('td')[10].innerHTML.trim();
        subject.fnl = subjectsHTML[i].querySelectorAll('td')[11].innerHTML.trim();
        subject.avg = subjectsHTML[i].querySelectorAll('td')[13].innerHTML.trim().replace("&nbsp;","");

        console.log('name: '+subject.name);
        console.log('sdf1: '+subject.sdf1);

        subjects[i-2] = subject;
    }

    console.log('------------')
    printStudentGrades(subjects);

    return subjects;
}

function printStudentGrades(subjects){
    for(var i=0;i<subjects.length;i++){

    console.log("------ "+subjects[i].name+" ------")
        for(var key in subjects[i]){
            if(key != "name"){
                console.log("    "+key+": "+subjects[i][key]);
            }
        }
    }
}
