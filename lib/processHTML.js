module.exports = {
    getGrades: function(gradesTable){
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
    },
    getSemesterAverage: function(gradesTable){
        return gradesTable[gradesTable.length-1].querySelector('td:last-child').innerHTML.replace(/<\/?[^>]+(>|$)/g, ""); // To delete any inner htlm tag
    }
};