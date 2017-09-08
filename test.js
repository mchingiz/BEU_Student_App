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

var old_time = new Date();

request(loginOptions, function (error, response, body) {
    if (error) throw new Error(error);

    // console.log(response.body.length);

    // gradeOptions[Math.floor(new Date())] = '';

    request(gradeOptions,function(error,response,body){
        if (error) throw new Error(error);

        eval("var res = " + body);

        // console.log(res.DATA);


        var new_time = new Date();
        var seconds_passed = new_time - old_time;

        console.log(seconds_passed)

        // var $ = cheerio.load(res.DATA)

        // console.log(response.statusCode)
        // console.log(response.req._header)
        // console.log(j.getCookies('https://my.qu.edu.az/index.php'))
        // console.log(gradeOptions)


        // console.log();
    })
});

var toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
