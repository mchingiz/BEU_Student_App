const Browser = require('zombie');

module.exports = {
    visitWebsite: function(userDetails){
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
    },

    fillFormAndSubmit: function(data){
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
    },

    checkForAnnouncement: function(data){

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
    },

    checkForWrongCredentials: function(data){
        console.log('parol ve usernamei yoxlayir');

        var promise = new Promise(function(resolve,reject){
            console.log('in promise');

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
    },

    getGradesAsHTML: function(data){
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
    },

    getStudentDetails: function(data){
        var promise = new Promise(function(resolve,reject){
            data.studentFullname = data.browser.querySelectorAll(".clsTbl tbody tr td")[1].innerHTML.trim();

            resolve(data);
        });

        return promise;
    },

    getCourseList: function(data){
        var promise = new Promise(function(resolve,reject){
            data.browser.wait().then(function(err){
                data.browser.location = "?mod=ejurnal";
                data.browser.wait().then(function(err){
                    // console.log(browser.query())
                    // console.log(browser.document.documentElement.innerHTML);

                    if(err){
                        reject({
                            statusCode: 500,
                            messages: {
                                az: "Qayiblari goturerken problem yarandi",
                                en: "There was a problem when we tried to get absences"
                            }
                        })
                    }

                    data.coursesTable = data.browser.querySelectorAll('#divCont table tbody tr');

                    console.log('Qiymet cedvelini goturdu');
                    resolve(data);
                })
            })
        });

        return promise;
    }
};