var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaOptions = {
    strict: false,
    versionKey: false
};

var androidLog = new Schema({},schemaOptions);

var AndroidLog = mongoose.model('AndroidLog', androidLog);

module.exports = AndroidLog;