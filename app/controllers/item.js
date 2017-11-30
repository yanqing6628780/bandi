var mongoose = require('mongoose');
let fn = require('../utils/fn.js');
module.exports = function (app) {
    var exports = {},
        articleM = app.models.articles,
        categoryM = app.models.categorys;
    exports.detail = (req, res, next) => {
        let id;
        try {
            id = mongoose.Types.ObjectId(req.params.id);
        } catch (error) {
            return app.notFound(req, res, next);
        }
        articleM.findOne({
                _id: id
            })
            .populate('cids')
            .exec()
            .then((rs) => {
                if (!rs) return next(new Error('404'));
                let p = [];
                for (let x of Array.from(rs.cids)) {
                    p.push(categoryM.findTree(x.id));
                }
                return Promise.all(p).then((bclists) => {
                    return [rs, bclists];
                });
            })
            .then((data) => {
                let view = data[0].is_product ? 'product' : 'article';
                res.render(view, {
                    title: data[0].name,
                    item: data[0],
                    bclists: data[1]
                });
            });
    };

    exports.online = (req, res, next) => {
        let where = {
            is_product: true,
            is_online_shop: true
        };
        let page = req.query.page ? (req.query.page - 1) : 0;
        let limit = 10;
        articleM.pagination(where, page, limit).then((data) => {
            if (!data[1]) return next(new Error('404'));
            res.render('item_list', {
                title: '网店商品',
                subtitle: 'ONLINE SHOP TOPICS',
                bclist: ['网店商品'],
                page: req.query.page,
                pageNums: Math.ceil(data[0] / limit),
                list: data[1]

            });
        });
    };

    exports.all = (req, res, next) => {
        let where = {
            is_product: true
        };
        let page = req.query.page ? (req.query.page - 1) : 0;
        let limit = 10;
        let sort = fn.parseSort(req);
        where = fn.parseWhere(req, where);
        articleM.pagination(where, page, limit, sort).then((data) => {
            if (!data[1]) return app.notFound(req, res, next);
            res.render('item_all', {
                query: req.query,
                page: req.query.page,
                pageNums: Math.ceil(data[0] / limit),
                total: data[0],
                list: data[1],
                bclist: ['所有商品']
            });
        });
    };

    return exports;
};
