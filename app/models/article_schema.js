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
    desc: {
        type: String
    },
    content: {
        type: String
    },
    url: {
        type: String
    },
    cover_pic: {
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
    is_product: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0
    },
    release_date: {
        type: Date,
        default: new Date()
    },
    target_age: {
        type: String,
        default: ""
    },
    start_date: {
        type: String,
        default: ""
    },
    end_date: {
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
schema.path('cover_pic').set(function (v) {
    if (v) {
        var filePath = path.join(configs.path.public, v);
        if (!fs.existsSync(filePath)) {
            v = "";
        }
        return v;
    }
});

const Model = mongoose.model(tableName, schema);

// return Promise
// Promise data data[0]总数据量 data[1]文章数据
Model.pagination = (where, page, limit, sort) => {
    let p = Model.find(where);
    if (where.cids) {
        for (const cid of where.cids) {
            p.where('cids', cid);
        }
    }
    p = p.limit(limit).skip(page);
    if(sort) {
        p.sort(sort);
    }
    return Promise.all([
        Model.find(where).count(),
        p
    ]);
};

module.exports = Model;
