const Browser = require('zombie');

module.exports = {
    visitWebsite: function(userDetails){
        console.log('visit website');
        console.log('userDetails:');

        var promise = new Promise(function(resolve,reject){
            Browser.visit('https://my.qu.edu.az',function(err,browser){
                if(err){
                    console.log("sayta gire bilmedik");

                    reject({
                        statusCode: 500,
                        html: data.html,
                        messages: {
                            az: "Sayta gire bilmedik",
                            en_US: "Couldn't enter the site"
                        }
                    })
                }

                // Everything that needs to be passed to next promises will be appended to 'data' object,
                // and it will be passed along.
                var data = {
                    browser: browser,
                    html: {} // will be used to log html content of visited pages
                };

                for(var key in userDetails){
                    data[key] = userDetails[key];
                }

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
                            html: data.html,
                            messages: {
                                az: "Hesaba giremmedik",
                                en_US: "Couldn't log in"
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
                            html: data.html,
                            messages: {
                                az: "Elani kece bilmedik",
                                en_US: "Couldn't pass by announcement"
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

            if(data.browser.querySelector("input[name='username']") ){
                console.log('parol ya username sehvdi');


                reject({
                    statusCode: 400,
                    html: data.html,
                    messages: {
                        az: "Parol zad sehvdi",
                        en_US: "Credentials are wrong"
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
                    data.html.grades = data.browser.document.documentElement.innerHTML;

                    if(err){
                        reject({
                            statusCode: 500,
                            html: data.html,
                            messages: {
                                az: "Qiymetleri goturerken problem yarandi",
                                en_US: "There was a problem when we tried to get grades"
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
            console.log(data.studentFullname);
            resolve(data);
        });

        return promise;
    },

    navigateToAttendance: function(data){
        var promise = new Promise(function(resolve,reject){

            data.browser.wait().then(function(err){
                data.browser.location = "?mod=ejurnal";
                data.browser.wait().then(function(err){
                    data.html.attendance = data.browser.document.documentElement.innerHTML;
                    if(err){
                        reject({
                            statusCode: 500,
                            html: data.html,
                            messages: {
                                az: "Elektron jurnala kecerken problem yarandi",
                                en_US: "There was a problem when we tried to go to electronic attendance page"
                            }
                        })
                    }

                    console.log('Elektron jurnal sehifesindeyik');

                    if(selectOptionExists(data.browser,'#ysem','2016#2')){
                        data.browser.select('#ysem','2016#2');

                        console.log('2016in 2ci semestrin secdik');

                        data.browser.pressButton('input.btn',function(err){
                            if(err){
                                console.log('error on pressing "goster" button');

                                reject({
                                    statusCode: 500,
                                    html: data.html,
                                    messages: {
                                        az: "Dərslərin siyahısını ala bilmədik",
                                        en_US: "Couldn't get course list"
                                    }
                                });
                            }

                            console.log('dropdowndan secib gosteri klikledik');
                            resolve(data);
                        });
                    }else{
                        console.error('2016in 2ci semestrin sece bilmedik');

                        reject({
                            statusCode: 500,
                            html: data.html,
                            messages: {
                                az: "Dərslərin siyahısını ala bilmədik",
                                en_US: "Couldn't get course list"
                            }
                        });
                    }
                })
            })
        });

        return promise;
    },

    navigateToAttendanceForSubject: function(data){
        console.log('navigating for subject absences');

        var promise = new Promise(function(resolve,reject){
            data.browser.wait().then(function(err){
                if(err){
                    reject({
                        statusCode: 500,
                        html: data.html,
                        messages: {
                            az: "Elektron jurnaldan qayiblari goturmeye calisirdiq,problem cixdi mans",
                            en_US: "Elektron jurnaldan qayiblari goturmeye calisirdiq,problem cixdi mans"
                        }
                    })
                };

                var courseLink = data.browser.querySelectorAll('#divCont a')[data.courseId];

                console.log('will get absences for '+courseLink.innerHTML);

                data.browser.clickLink(courseLink.innerHTML,function(err){
                    if(err){
                        reject({
                            statusCode: 500,
                            html: data.html,
                            messages: {
                                az: "Elektron jurnaldan qayiblari goturmeye calisirdiq,problem cixdi mans",
                                en_US: "Elektron jurnaldan qayiblari goturmeye calisirdiq,problem cixdi mans"
                            }
                        })
                    };

                    console.log('clicked and in course page');

                    resolve(data);
                })
            })
        });

        return promise;
    },

    getCoursesAsHTML: function(data){
        var promise = new Promise(function(resolve,reject){
            data.coursesTable = data.browser.querySelectorAll('#divCont table tbody tr');

            console.log('Qiymet cedvelini goturdu');
            resolve(data);
        });

        return promise;
    },

     getAbsencesAsHTML: function(data){
        console.log('getting absences as html');

        var promise = new Promise(function(resolve,reject){
            data.html.absence = data.browser.document.documentElement.innerHTML;

            var absencesTable = data.browser.querySelectorAll("#tblJourn tr");

            data.absencesTable = absencesTable;

            // console.log(absencesTable);


            resolve(data);
        });

        return promise;
    }
};

function selectOptionExists(browser,selectName,optionValue){
    for (var i = 0; i < browser.querySelector(selectName).length; ++i){
        console.log(browser.querySelector(selectName).options[i].value);

        if (browser.querySelector(selectName).options[i].value == optionValue){
            return true;
        }
    }

    return false;
}