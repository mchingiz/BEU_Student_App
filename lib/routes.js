const app = require('express')();
const Browser = require('zombie');
const crawler = require('lib/crawler.js');

app.get('/', function (req, res) {
    console.log('index');

    res.sendFile(__dirname + '/index.html');
});

app.post('/getGrades', function (req, res) {
    console.log('request');

    // Can delete on production
    // res.header('Access-Control-Allow-Origin', 'http://beu-calculator.herokuapp.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    var username;
    var password;
    var lang = req.body.lang;

    if(process.env.ENV == "pro"){
        username = req.body.username;
        password = req.body.password;
    }else if(process.env.ENV == "dev"){
        username = process.env.STUDENT_ID;
        password = process.env.STUDENT_PASSWORD;
    }

    var getGrades = new Promise(function(resolve,reject){
        var data = {};

        Browser.visit('https://my.qu.edu.az',function(e,browser){
            // console.log(browser.document.documentElement.innerHTML);

            console.log('requested homepage / '+username+' / '+password);
            console.log('in page');

            crawler.login(browser,reject);

            browser.wait().then(function(){
                if(browser.location.href == 'https://my.qu.edu.az/announcement.php'){
                    console.log('announcement');

                    crawler.passByAnnouncement(browser,reject);

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
    });

    getGrades
    .then(function(statusCode,data){
        console.log(statusCode);
        console.log(data);

        res.status(statusCode).json(data);
    })
    .catch(function(statusCode,message){
        console.log(statusCode + " / " + message);

        res.status(statusCode).json({
            message:message
        });
    })


});