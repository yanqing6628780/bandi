var mongoose = require('mongoose');
var tableName = 'categorys';
// Schema 结构
var Schema = mongoose.Schema;
var schema = new Schema({
    parent_id: {
        type: Schema.Types.ObjectId,
        ref: tableName
    },
    level: {
        type: Number,
        default: 1
    },
    display_name: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
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

schema.path('level').set(function() {
    if (this.parent_id) {
        this.level = this.parent_id.level + 1;
    } else {
        return 1;
    }
});
schema.virtual('children', {
    ref: tableName,
    localField: '_id',
    foreignField: 'parent_id'
});

module.exports = mongoose.model(tableName, schema);