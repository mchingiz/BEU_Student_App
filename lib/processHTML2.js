var cheerio = require('cheerio');

module.exports = {

    getGrades: function(html){
        try{
            var $ = cheerio.load(html);
            var subjectCount = $('table tbody tr').length;

            var subjects = [];

            for(var i=3;i<=subjectCount-1;i++){
                var subject = {};

                subject.code = $('table tbody tr:nth-child('+i+') td:nth-child(1)').text();
                subject.name = $('table tbody tr:nth-child('+i+') td:nth-child(4)').text();
                subject.ects = $('table tbody tr:nth-child('+i+') td:nth-child(5)').text().trim();
                subject.abs = $('table tbody tr:nth-child('+i+') td:nth-child(6)').text().trim();
                subject.sdf1 = $('table tbody tr:nth-child('+i+') td:nth-child(7)').text().trim();
                subject.sdf2 = $('table tbody tr:nth-child('+i+') td:nth-child(8)').text().trim();
                subject.sdf3 = $('table tbody tr:nth-child('+i+') td:nth-child(9)').text().trim();
                subject.ff = $('table tbody tr:nth-child('+i+') td:nth-child(10)').text().trim();
                subject.dvm = $('table tbody tr:nth-child('+i+') td:nth-child(11)').text().trim();
                subject.fnl = $('table tbody tr:nth-child('+i+') td:nth-child(12)').text().trim();
                subject.extraExam = $('table tbody tr:nth-child('+i+') td:nth-child(13)').text().trim();
                subject.retakeExam = $('table tbody tr:nth-child('+i+') td:nth-child(14)').text().trim();
                subject.avg = $('table tbody tr:nth-child('+i+') td:nth-child(15)').text().trim().replace("&nbsp;","");

                // console.log('name: '+subject.name);
                // console.log('sdf1: '+subject.sdf1);

                subjects.push(subject);
            }

            console.log('------------');

            return subjects;
        }catch(err){
            return {
                error: true,
                statusCode: 500,
                html: html,
                messages: {
                    az: "Qiymetleri goturerken problem yarandi",
                    en_US: "There was a problem when we tried to get grades"
                }
            }
        }
    },

    getSemesterAverage: function(html){
        var $ = cheerio.load(html);
        return $('table tbody tr:last-child td:last-child').text().replace(/<\/?[^>]+(>|$)/g, "").trim();
    },

    getCourses: function(html){
        try{
            console.log(html);
            var $ = cheerio.load(html);
            var courseCount = $('table tbody tr').length;

            var courses = [];

            console.log('processing courses');

            for(var i=2;i<=courseCount;i++){
                var course = {};

                course.id = $('table tbody tr:nth-child('+i+') td:nth-child(2) a').attr("onclick").substr(11,5);
                course.code = $('table tbody tr:nth-child('+i+') td:nth-child(2) a').text().trim();
                course.name = $('table tbody tr:nth-child('+i+') td:nth-child(3) label').text().trim();
                course.teacher = $('table tbody tr:nth-child('+i+') td:nth-child(4)').text().trim();
                course.credit = $('table tbody tr:nth-child('+i+') td:nth-child(5)').text().trim();
                course.hour = $('table tbody tr:nth-child('+i+') td:nth-child(6)').text().trim();
                course.limit = $('table tbody tr:nth-child('+i+') td:nth-child(7)').text().trim();
                course.attended = $('table tbody tr:nth-child('+i+') td:nth-child(8)').text().trim();
                course.notAttended = $('table tbody tr:nth-child('+i+') td:nth-child(9)').text().trim();
                course.percent = $('table tbody tr:nth-child('+i+') td:nth-child(10)').text().trim();

                console.log(course.id);

                courses.push(course);
            }

            return courses;
        }catch(err){
            return {
                error: true,
                statusCode: 500,
                html: html,
                messages: {
                    az: "Fennlerin siyahisini goturerken problem yarandi",
                    en_US: "Problem with get courses"
                }
            }
        }
    },

    getAbsences: function(html){
        try{
            console.log(html);
            var $ = cheerio.load(html);
            var lessonCount = $('table tbody tr').length;

            lessons = [];

            console.log('processing absences');

            for(var i=3;i<=lessonCount-2;i++){
                lesson = {};

                lesson.date = $('table tbody tr:nth-child('+i+') td:nth-child(2)').text();
                lesson.hour = $('table tbody tr:nth-child('+i+') td:nth-child(3)').text();
                lesson.absence = $('table tbody tr:nth-child('+i+') td:nth-child(4)').text();
                lesson.place = $('table tbody tr:nth-child('+i+') td:nth-child(5)').text();

                console.log(lesson.date);
                // console.log(lesson);

                lessons.push(lesson);
            }

            return lessons;
        }catch(err){
            return {
                error: true,
                statusCode: 500,
                html: html,
                messages: {
                    az: "Absences goturemmedi",
                    en_US: "Absences problem"
                }
            }
        }
    }
};


var toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}