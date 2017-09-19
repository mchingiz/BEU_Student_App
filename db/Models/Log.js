var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaOptions = {
    // timestamps: {
    //     createdAt: 'created_at',
    //     updatedAt: false
    // },
    versionKey: false
};

var log = new Schema({
    req: {
        body: {
            type: Schema.Types.Mixed,
            required: true
        },
        ip: {
            type: String
        },
        originalUrl: {
            type: String
        }
    },
    html: {
        type: Schema.Types.Mixed
    },
    res: {
        statusCode: {
            type: Number,
            required: true
        },
        data: {
            type: Schema.Types.Mixed
        },
        time: {
            type: Number
        }
    },
    errorStack: {
        type: Schema.Types.Mixed
    },
    created: {
        type: Date,
        default: Date.now
    }
},schemaOptions);

var Log = mongoose.model('Log', log);

module.exports = Log;