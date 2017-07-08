const browser = {
    login: function(browser,reject){
        browser.fill('input[name=username]',username)
            .fill('input[name=password]',password)
            .pressButton('input[name=LogIn]',function(err){
                if(err){
                    console.log('error on pressing login');

                    var statusCode = 500;
                    var errorMessage;

                    if(lang == "az"){
                        errorMessage = "Hesaba giriş edə bilmədik, zəhmət olmasa təkrar 'daxil ol' düyməsini basın";
                    }else if(lang == "en_US"){
                        errorMessage = "Something went wrong. Please try again by clicking 'login'"
                    }

                    reject(statusCode,errorMessage);
                }else{
                    console.log('logged in succesfully');
                }
            });
    },
    passByAnnouncement: function(browser,reject){
        browser.pressButton('input[name=btnOxudum]',function(err){
            if(err){

                var statusCode = 500;
                var errorMessage;

                if(lang == "az"){
                    errorMessage = "Qiymətləri götürərkən problem yarandı, zəhmət olmasa təkrar 'hesabla' düyməsini bas";
                }else if(lang == "en_US"){
                    errorMessage = "Something went wrong when we tried to get your grades. Please try again by click 'login'";
                }

                console.log("Qiymətləri götürərkən problem yarandı, zəhmət olmasa təkrar 'hesabla' düyməsini bas");

                reject(statusCode,errorMessage);
            }else{
                console.log('Passed by announcement successfully');
            }
        })
    },
    checkIfIsLoggedIn: function(browser,reject){
        if(browser.querySelector("input[name=username]")){
            console.log("wrong credentials");

            var statusCode = 400;
            var errorMessage;

            if(lang == "az"){
                errorMessage = "Girdiyin tələbə nömrəsi və ya parol səhvdir, zəhmət olmasa düzgün versiyalarını yazıb, bir daha yoxla";
            }else if(lang == "en_US"){
                errorMessage = "Credentials you have entered are wrong. Please correct them and try again";
            }

            reject(statusCode,errorMessage);

            return;
        }

        // logger.info(" student_id: %s", username);
    }
};