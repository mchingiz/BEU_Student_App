const request = require('request');
var j = request.jar();
const Browser = require('zombie');
var browser = new Browser();

console.log('-------- RESTARTED --------');


// Resources
// https://stackoverflow.com/questions/15486911/crawling-links-on-a-page-then-visiting-and-inspecting-each-link-with-node-and-z
// http://nodeexamples.com/2013/05/21/scraping-webpages-using-zombie-js/

// -----------------------------------
// ------------ VERSION 1 ------------
// -----------------------------------

// request.post({
//     url: 'https://my.qu.edu.az/loginAuth.php',
//     jar: j,
//     headers: {
//         'Origin': 'https://my.qu.edu.az',
//         'User-Agent': 'User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
//     },
//     form: {
//         "username":"140105023",
//         "password":"c171617126m",
//         "LogIn": " Daxil ol "
//     }
// }, function(error, response, body){
//     console.log(response);
//
//     // request.get({
//     //     url:"https://my.qu.edu.az/?mod=grades",
//     //     header: response.headers
//     // },function(error, response, body){
//     //     // The full html of the authenticated page
//     //     console.log(body);
//     // });
// });

// -----------------------------------
// ------------ VERSION 2 ------------
// -----------------------------------

// var reqDetails = {
//   url: 'https://api.github.com/repos/request/request',
//   headers: {
//     'User-Agent': 'request'
//   }
// };
//
// function callback(error, response, body) {
//   if (!error && response.statusCode == 200) {
//     var info = JSON.parse(body);
//     console.log(info.stargazers_count + " Stars");
//     console.log(info.forks_count + " Forks");
//   }
// }
//
// request(reqDetails, callback);
