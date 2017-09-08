require('dotenv').config();
var request = require("request");
var j = request.jar();
var cheerio = require('cheerio')

var loginOptions = {
    method: 'POST',
    url: 'https://my.qu.edu.az/loginAuth.php',
    jar:j,
    // headers: {
    //     // 'postman-token': 'e14d2590-baa9-2057-aa27-bc2da52b9bba',
    //     // 'user-agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    //     // 'cache-control': 'no-cache',
    //     'content-type': 'application/x-www-form-urlencoded'
    // },
    form:{
        username: process.env.STUDENT_ID,
        password: process.env.STUDENT_PASSWORD,
        LogIn: ' Daxil ol '
    },
    followAllRedirects: true
};

var gradeOptions = {
    method: 'POST',
    url: 'https://my.qu.edu.az/index.php',
    jar:j,
    headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
        ajx: '1',
        mod: 'grades',
        action: 'GetGrades',
        yt: '2016#2'
    }
};

var absenceOptions = {
    method: 'POST',
    url: 'https://my.qu.edu.az/index.php',
    jar:j,
    headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
        ajx: '1',
        mod: 'ejurnal',
        action: 'getCourses',
        yt: '2016#2'
    }
};

var viewCourseOptions = {
    method: 'POST',
    url: 'https://my.qu.edu.az/index.php',
    jar:j,
    headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
        ajx: '1',
        mod: 'ejurnal',
        action: 'viewCourse',
        derst: '23276'
    }
};

function logIn(){
    return new Promise(function(resolve,reject){
        console.log('login promise')
        request(loginOptions, function (error, response, body) {
            if (error){
                reject("Couldn't log in");
            }else{
                console.log('login answered');
                resolve();
            }
        });
    })
}


function getAbsences(){
    return new Promise(function(resolve,reject){
        console.log('getAbsences promise')
        request(absenceOptions,function(error,response,body){
            console.log("getAbsences answered")
            if (error){
                // throw new Error(error);
                reject("Couldn't get absences")
            }else{
                console.log('got absences');
                resolve(body);
            }
        })
    })
}

function getGrades(){
    return new Promise(function(resolve,reject){
        console.log('getgrades promise')
        request(gradeOptions,function(error,response,body){
            console.log("getGrades answered")
            if (error){
                // throw new Error(error);
                reject("Couldn't get grades")
            }else{
                console.log('got grades');
                eval("var res = " + body);

                resolve(res.DATA);
            }
        })
    })
}

function viewCourse(){
    return new Promise(function(resolve,reject){
        console.log('viewCourse promise')
        request(viewCourseOptions,function(error,response,body){
            console.log("viewCourse answered")
            if (error){
                // throw new Error(error);
                reject("Couldn't get viewCourse")
            }else{
                console.log('got viewCourse');
                eval("var res = " + body);

                resolve(res.DATA);
            }
        })
    })
}


var promise = logIn()
    .then(viewCourse)
    .then(function(data){
        console.log(data);
    })

var toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
