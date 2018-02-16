require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./lib/routes.js');
const middlewares = require('./lib/middlewares.js');
console.log("restarted");

// --------- PACKAGE SETTINGS ---------
var dbUsername = process.env.MONGO_USERNAME;
var dbPassword = process.env.MONGO_PASSWORD;

if(process.env.ENVIRONMENT == "pro"){
    var connectionUrl = "mongodb://"+dbUsername+":"+dbPassword+"@localhost:27017/beu?authSource=admin";
    require('mongoose')
        .connect(connectionUrl)
        .then(function(){
            console.log('dbConnected');
        }).catch(function(err){
            console.log('dbConnectionError');
            console.log(err)
        });
}

app.use(express.static('public'));
app.set('port', 3000);

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use('/',middlewares);

// --------- FUNCTIONALITY ---------
app.use('/',routes);



app.listen(app.get('port'),function(){
    console.log('listening on port '+app.get('port'));
});
