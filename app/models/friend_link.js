var mongoose = require('mongoose');
var tableName = 'friend_link';
// Schema 结构
var Schema = mongoose.Schema;
var schema = new Schema({
    name: {
        type: String,
        trim: true
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
