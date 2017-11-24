var mongoose = require('mongoose');
var fs = require('fs');
var configs = require('../../config');
var path = require('path');

// var categoryModel = require('./category_schema');
var tableName = 'articles';

// Schema 结构
var Schema = mongoose.Schema;
var schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    cids: [{
        type: Schema.Types.ObjectId,
        ref: 'categorys'
    }],
    content: {
        type: String
    },
    url: {
        type: String
    },
    images: {
        type: Array,
        default: []
    },
    code: {
        type: String,
        default: ""
    },
    is_online_shop: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0
    },
    release_date: {
        type: String,
        default: ""
    },
    target_age: {
        type: String,
        default: ""
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

schema.virtual('images_str').get(function() {
    if (this.images) {
        return this.images.join(',');
    }
    return "";
}).set(function(v) {
    if (v) {
        this.images = [];
        var images = v.split(',');
        for (var key in images) {
            var item = images[key];
            if (item) {
                var filePath = path.join(configs.path.public, item);
                if (fs.existsSync(filePath)) {
                    this.images.push(images[key]);
                }
            }
        }
    } else {
        this.images = [];
    }
});

module.exports = mongoose.model(tableName, schema);