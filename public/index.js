const studentForm = $('.ui.studentForm');
const grades = $('#grades');
const gradesTable = $('#grades table');
const loader = $('#loader');
const errorBox = $("#errorBox");

var jokeInterval;
var serverTimeout;

function populateTable(subjects){
    for(var i=0;i<subjects.length;i++){
        // console.log(subjects[i].name);

        var targetScores = calculateTargetPoints(subjects[i]);

        var $subjectTR = $("<tr>")
            .append($("<td>").text(subjects[i].code))
            .append($("<td>").text(subjects[i].ects))
            .append($("<td>").text(subjects[i].name))
            .append($("<td>").text(subjects[i].sdf1))
            .append($("<td>").text(subjects[i].sdf2))
            .append($("<td>").text(subjects[i].sdf3))
            .append($("<td>").text(subjects[i].ff))
            .append($("<td>").text(subjects[i].dvm))
            .append($("<td>").text(subjects[i].fnl))
            .append($("<td class='bold'>").text(subjects[i].avg))

        if(subjects[i].avg == ""){ // Subject is not complete
            $subjectTR.append($("<td>").text(targetScores["51"]))
                    .append($("<td>").text(targetScores["71"]))
                    .append($("<td>").text(targetScores["91"]))
        }else if(subjects[i].avg >= 51){ // Subject is passed
            $subjectTR.append($("<td>").attr("colspan","3").addClass("center aligned passedSubject").html("passed"))
        }else if(subjects[i].avg < 51){ // Subject failed
            $subjectTR.addClass("negative");
        }


        // console.log($subjectTR);
        gradesTable.find("tbody").append($subjectTR);
    }
}

function calculateTargetPoints(subject,target){
    var res = {};

    if(subject.avg != ""){ // Then subject is complete, no need to calculate target points
        return res;
    }

    var entryPoint = 0;

    subject.sdf1 !== ( "Q" || "" ) ? entryPoint += subject.sdf1/10 : entryPoint += 0;
    subject.sdf2 !== ( "Q" || "" ) ? entryPoint += subject.sdf2/10 : entryPoint += 0;
    subject.sdf3 !== ( "Q" || "" ) ? entryPoint += subject.sdf3/10 : entryPoint += 0;
    subject.ff !== ( "Q" || "" ) ? entryPoint += subject.ff/10 : entryPoint += 0;
    subject.dvm !== ( "Q" || "" ) ? entryPoint += subject.dvm/10 : entryPoint += 0;

    // console.log(subject.name + ': ' + entryPoint);

    res["51"] = Math.ceil( (51-entryPoint)*2 );
    res["71"] = Math.ceil( (71-entryPoint)*2 );
    res["91"] = Math.ceil( (91-entryPoint)*2 );

    return res;
}

$('.ui.form').form({
    inline: true,
    fields: {
        username: {
            identifier: 'username',
            rules: [
                {
                    type: 'empty',
                    prompt: 'Zəhmət olmasa tələbə nömrənizi yazın'
                },
                {
                    type: 'exactLength[9]',
                    prompt: 'Tələbə nömrəsinin uzunluğu 9 simvol olmalıdır'
                }
            ]
        },
        password: {
            identifier: 'password',
            rules: [{
                type: 'empty',
                prompt: 'Zəhmət olmasa parolunuzu yazın'
            }]
        }
    },
    onSuccess: function(event, fields) {

        var username = studentForm.find("input[name=username]").val();
        var password = studentForm.find("input[name=password]").val();

        loader.hide();
        grades.hide();
        errorBox.hide();

        var validationResult = studentForm.form('is valid');

        if(validationResult){
            // console.log('asdf');

            loader.show();

            jokeInterval = setInterval(changeLoadingText,5000);
            serverTimeout = setTimeout(errorOnServerSide, 35000);

            userData = {
                username: username,
                password: password
            }

            $.ajax({
    			type: 'POST',
    			data: JSON.stringify(userData),
    	        contentType: 'application/json',
                url: 'http://beu-calculator.herokuapp.com/getData',
                success: function(data) {
                    // console.log('success');

                    if(!data.error){
                        clearTimeout(serverTimeout);

                        gradesTable.find("tbody").empty();
                        populateTable(data);
                        grades.show();
                    }else{
                        errorBox.find(".header").text(data.error);
                        errorBox.show();
                    }

                    loader.hide();

                    clearInterval(jokeInterval);
                }
            });
        }

        event.preventDefault();
    }
});

var jokeNumber = 0;

function changeLoadingText(){
    var currentJoke = $(".ui.massive.text.loader");

    // console.log("currentJoke: "+currentJoke)

    while(currentJoke.text() == kindaFunny[jokeNumber]){
        jokeNumber = Math.floor(Math.random() * kindaFunny.length);
        // console.log(jokeNumber.text());
    }

    // console.log("newJoke: "+kindaFunny[jokeNumber])

    currentJoke.text(kindaFunny[jokeNumber]);
}

function errorOnServerSide(){
    errorBox.find(".header").text("Səbəbini bilmədiyimiz bir problem baş verdi, zəhmət olmasa yenidən yoxla");
    loader.hide();
    grades.hide();
    errorBox.show();
}

var kindaFunny = [
    "Biraz daha gözlə",
    "Vaxtını da alırıq, üzrlü say",
    "Hesablayırıq",
    "Qiymətlərin də qiymət ola",
    "Bu gedişlə təqaüdə də düşməzsən sən",
    "Başın var amma oxumursan",
    "Camaatın uşağı qiymət hesablamadan girir imtahana",
    "Uzaqbaşı gələn il girərsən",
    "Deyirlər yay məktəbinin də qiymətləri qalxacaq",
    "Biraz da bəxt işidi bu qiymət məsələsi,ürəyinə salma",
]

var exampleData = [
    {
        name: "Data Structures and Algorithms",
        code: "COMP 202",
        abs: "6",
        avg: "98",
        ects: "6",
        dvm: "90",
        ff: "100",
        fnl: "100",
        sdf1: "90",
        sdf2: "90",
        sdf3: "100",
    },{
        name: "Numerical Analysis",
        code: "COMP 305",
        abs: "5",
        avg: "58",
        ects: "6",
        dvm: "30",
        ff: "170",
        fnl: "190",
        sdf1: "30",
        sdf2: "10",
        sdf3: "400",
    }
]
