let lodash = require('lodash');

module.exports = function(db) {
    let Model = db.categorys;
    let modelName = Model.modelName;
    let exports = {};

    exports.run = function() {
        let data = [
            {
                display_name: "高达模型",
                name: "GUNPLA",
                parent_id: null
            },
            {
                display_name: "角色模型",
                name: "CHARACTER",
                parent_id: null
            },
            {
                display_name: "事件",
                name: "EVENT",
                parent_id: null
            },
            {
                display_name: "活动",
                name: "CAMPAIGN",
                parent_id: null
            },
            {
                display_name: "新闻",
                name: "NEWS",
                parent_id: null
            },
            {
                display_name: "GBWC比赛",
                name: "GBWC",
                parent_id: null
            }
        ];
        let childrenData = [
            {
                display_name: "牌子",
                name: "brand",
                parent_id: null
            },
            {
                display_name: "系列",
                name: "series",
                parent_id: null
            }
        ];
        return Model.remove().then(() => {
            return Model.create(data)
                .then(function (docs) {
                    // console.log(modelName, docs);
                    console.log(modelName + ' insert success.');
                    return docs;
                }).then(function (docs) {
                    let childrenArr = [];
                    docs.forEach((item) => {
                        if (item.name == data[0].name || item.name == data[1].name) {
                            let child = lodash.cloneDeep(childrenData);
                            child[0].parent_id = child[1].parent_id = item._id;
                            childrenArr = childrenArr.concat([], child);
                        }
                    });
                    return Model.create(childrenArr);
                })
                .catch(function (err) {
                    console.log(modelName + ' insert failed.err:');
                    console.log(err);
                });
        }).catch((err) => {
            if (err) console.log('remove error', err);
        });
    };

    return exports;
};
