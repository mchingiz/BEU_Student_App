require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Browser = require('zombie');
const app = express();
const routes = require('./lib/routes2.js');
const middlewares = require('./lib/middlewares.js');
// const dbMiddleware = require('./db/config.js');

// require('mongoose').connect('mongodb://localhost:27017/beu',{
// 	user: process.env.MONGO_USERNAME,
// 	pass: process.env.MONGO_PASSWORD
// }).then(function(){
// 	console.log('dbConnected');
// });

// --------- PACKAGE SETTINGS ---------

Browser.waitDuration = '30s';
app.use(express.static('public'));
app.set('port', 3000);

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use('/',middlewares);

// --------- FUNCTIONALITY ---------
app.use('/',routes);

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!');
})



app.listen(app.get('port'),function(){
    console.log('listening on port '+app.get('port'));
});
