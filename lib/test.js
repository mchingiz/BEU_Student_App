var request = require("request");
var j = request.jar();

module.exports = {
    login: function(data){
        var options = {
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
                username: data.username,
                password: data.password,
                LogIn: ' Daxil ol '
            },
            followAllRedirects: true
        };

        return new Promise(function(resolve,reject){
            console.log('login promise')
            request(options, function (error, response, body) {
                if (error){
                    reject({
                        statusCode: 500,
                        html: data.html,
                        messages: {
                            az: "Login eleye bilmedik",
                            en_US: "Couldn't log in"
                        }
                    })
                }else{
                    console.log('login answered');
                    resolve(data);
                }
            });
        })
    },
    getGrades: function(data){
        var options = {
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
        console.log(data.username)

        return new Promise(function(resolve,reject){
            console.log('getgrades promise')
            request(options,function(error,response,body){
                console.log("getGrades answered")
                if (error){
                    // throw new Error(error);
                    reject({
                        statusCode: 500,
                        html: data.html,
                        messages: {
                            az: "Gradesi goture bilmedik",
                            en_US: "Couldn't get grades"
                        }
                    })
                }else{
                    console.log('got grades');
                    eval("var res = " + body);

                    data.gradesTable = res.DATA

                    resolve(data);
                }
            })
        })
    },
    getCourses: function(data){
        var options = {
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
                ysem: '2016#2'
            }
        };

        return new Promise(function(resolve,reject){
            console.log('getAbsences promise')
            request(options,function(error,response,body){
                console.log("getAbsences answered")
                if (error){
                    // throw new Error(error);
                    reject({
                        statusCode: 500,
                        html: data.html,
                        messages: {
                            az: "Coursesi goture bilmedik",
                            en_US: "Couldn't get courses"
                        }
                    })
                }else{
                    data.coursesTable = body;
                    resolve(data);
                }
            })
        })
    },
    getAbsences: function(data){
        var options = {
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
                derst: data.courseId
            }
        };

        return new Promise(function(resolve,reject){
            console.log('viewCourse promise')
            request(options,function(error,response,body){
                console.log("viewCourse answered")
                eval("var res = " + body);
                if (error || res.CODE == "-1"){
                    // throw new Error(error);


                    reject({
                        statusCode: 500,
                        html: data.html,
                        messages: {
                            az: "Absencei goture bilmedik",
                            en_US: "Couldn't get absences"
                        }
                    })
                }else{
                    console.log('got viewCourse');
                    console.log(body);

                    data.absencesTable = res.DATA;

                    resolve(data);
                }
            })
        })
    }
}

var toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
