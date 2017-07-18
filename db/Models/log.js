var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaOptions = {
    timestamps: {
        createdAt: 'created_at'
    },
    versionKey: false
};

var log = new Schema({
    reqParams: {
        type: Schema.Types.Mixed,
        // required: true
    },
    req: {
        type: Schema.Types.Mixed,
        // required: true
    },
    statusCode: {
        type: Number
    },
    res: {
        type: Schema.Types.Mixed,
        // required: true
    }
},schemaOptions);

var Log = mongoose.model('Log', log);

module.exports = Log;