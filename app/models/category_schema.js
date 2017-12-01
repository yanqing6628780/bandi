var mongoose = require('mongoose');
var configs = require('../../config');
var path = require('path');
var fs = require('fs');
var tableName = 'categorys';
// Schema 结构
var Schema = mongoose.Schema;
var schema = new Schema({
    parent_id: {
        type: Schema.Types.ObjectId,
        ref: tableName
    },
    display_name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    desc: {
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

schema.virtual('children', {
    ref: tableName,
    localField: '_id',
    foreignField: 'parent_id'
});

schema.path('parent_id').set(function (v) {
    return v = !v || v == 'null' ? null : v;
});

schema.path('image').set(function (v) {
    if (v) {
        var filePath = path.join(configs.path.public, v);
        if (!fs.existsSync(filePath)) {
            v = "";
        }
        return v;
    }
});

schema.post('save', function () {
    Model.updateTree();
});

const Model = mongoose.model(tableName, schema);

let categoryTree = [];
let categoryMap = [];
Model.getTree = () => {
    if (categoryTree.length) return Promise.resolve(categoryTree);
    let toTree = (data) => {
        var map = {};
        data.forEach(function (item) {
            map[item.id] = item.toObject();
        });
        categoryMap = data;
        var tree = [];
        data.map(function (item) {
            // 以当前遍历项，的pid,去map对象中找到索引的id
            if (item.parent_id) {
                var parent = map[item.parent_id._id];
                (parent.son || (parent.son = [])).push(map[item.id]);
            } else {
                tree.push(map[item.id]);
            }
        });
        return tree;
    };
    return Model.find().populate('parent_id').exec().then((rs) => {
        return categoryTree = toTree(rs);
    });
};
Model.updateTree = () => {
    categoryTree = [];
    return Model.getTree();
};

Model.findTree = (id) => {
    let familytree = (data, id) => {
        let tree = [];
        for (const x in data) {
            let item = data[x]
            if(item.id == id) {
                if (item.parent_id && item.parent_id.id) {
                    tree = tree.concat(familytree(data, item.parent_id.id));
                }
                tree.push(item);
            }
        }
        return tree;
    };
    return Model.getTree().then(() => {
        return familytree(categoryMap, id);
    });
};

module.exports = Model;
