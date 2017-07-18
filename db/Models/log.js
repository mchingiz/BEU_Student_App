var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var log = new Schema({
    req: {
        type: Schema.Types.Mixed,
        required: true
    },
    res: {
        type: Schema.Types.Mixed,
        required: true
    },
    created_at: Date
});

// the schema is useless so far
// we need to create a model using it
var Log = mongoose.model('Log', log);

// make this available to our users in our Node applications
module.exports = Log;