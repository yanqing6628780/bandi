var mongoose = require('mongoose');
var tableName = 'web_config';
// Schema 结构
var Schema = mongoose.Schema;
var schema = new Schema({
    key: {
        type: String,
        required: true,
        trim: true
    },
    value: {
        type: String,
        default: null
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        defalut: 'input'
    }
}, {
    timestamps: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

const Model = mongoose.model(tableName, schema);

module.exports = Model;
