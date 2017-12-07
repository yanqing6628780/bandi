let mongoose = require('mongoose');
let fs = require('fs');
let configs = require('../../config');
let path = require('path');
let tableName = 'articles';
let ObjectId = mongoose.Types.ObjectId;
// Schema 结构
let Schema = mongoose.Schema;
let schema = new Schema({
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
    tag: {
        type: String,
        default: "topics"
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
        let images = v.split(',');
        for (let key in images) {
            let item = images[key];
            if (item) {
                let filePath = path.join(configs.path.public, item);
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
        let filePath = path.join(configs.path.public, v);
        if (!fs.existsSync(filePath)) {
            v = "";
        }
        return v;
    }
});
schema.path('price').set(function (v) {
    if (v) {
        if (typeof v !== 'number') {
            v = 0;
        }
        return v;
    }
});

const Model = mongoose.model(tableName, schema);

// return Promise
// Promise data data[0]总数据量 data[1]文章数据
Model.pagination = (where, page, limit, sort) => {
    let cids = where.cids ? where.cids : undefined;
    delete where.cids;
    let p = Model.find(where);
    if (typeof cids === 'object') {
        let and_where = [];
        for (const cid of cids) {
            and_where.push({ cids: ObjectId(cid)});
        }
        p.and(and_where);
    } else {
        p.where('cids', ObjectId(cids));
    }
    p = p.limit(limit).skip(page);
    if(sort) {
        p.sort(sort);
    }
    return Promise.all([
        Model.find(p.getQuery()).count(),
        p
    ]);
};

module.exports = Model;
