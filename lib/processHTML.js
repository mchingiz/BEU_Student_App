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
    },

    getCourses: function(coursesTable){
        var courses = [];

        console.log('processing courses');

        for(var i=1;i<coursesTable.length;i++){
            var course = {};

            course.code = coursesTable[i].querySelectorAll('td a')[0].innerHTML.trim();
            course.name = coursesTable[i].querySelectorAll('td label')[0].innerHTML.trim();
            course.teacher = coursesTable[i].querySelectorAll('td')[3].innerHTML.trim();
            course.credit = coursesTable[i].querySelectorAll('td')[4].innerHTML.trim();
            course.hour = coursesTable[i].querySelectorAll('td')[5].innerHTML.trim();
            course.limit = coursesTable[i].querySelectorAll('td')[6].innerHTML.trim();
            course.attended = coursesTable[i].querySelectorAll('td')[7].innerHTML.trim();
            course.notAttended = coursesTable[i].querySelectorAll('td')[8].innerHTML.trim();
            course.percent = coursesTable[i].querySelectorAll('td')[9].innerHTML.trim();

            console.log(course);

            courses.push(course);
        }

        return courses;
    },

    getAbsences: function(absencesTable){
        lessons = [];

        console.log('processing absences');

        for(var i=2;i<absencesTable.length;i++){
            console.log('for');

            lesson = {};

            // console.log(absencesTable[i].querySelectorAll('td')[2].innerHTML);

            lesson.date = absencesTable[i].querySelectorAll('td')[1].innerHTML;
            lesson.hour = absencesTable[i].querySelectorAll('td')[2].innerHTML;
            lesson.absence = absencesTable[i].querySelectorAll('td')[3].innerHTML;
            lesson.place = absencesTable[i].querySelectorAll('td')[4].innerHTML;

            // console.log(lesson);

            lessons.push(lesson);
        }

        console.log('returned');

        return lessons;
    }
};