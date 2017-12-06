var mongoose = require('mongoose');
var tableName = 'ad';
// Schema 结构
var Schema = mongoose.Schema;
var schema = new Schema({
    name: {
        type: String,
        trim: true
    },
    cid: {
        type: Schema.Types.ObjectId,
        ref: 'categorys'
    },
    image: {
        type: String,
        required: true
    },
    url: {
        type: String
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
