require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const Browser = require('zombie');
const app = express();
const logger = require('./lib/logger.js'); // logger
const routes = require('./lib/routes.js');
const dbMiddleware = require('./db/config.js');

// --------- PACKAGE SETTINGS ---------

Browser.waitDuration = '30s';
app.use(express.static('public'));
app.set('port', 3000);

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(dbMiddleware);

app.use('/',routes);

// --------- FUNCTIONALITY ---------
app.listen(app.get('port'),function(){
    console.log('listening on port '+app.get('port'));
});