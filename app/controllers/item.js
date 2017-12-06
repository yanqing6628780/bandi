let mongoose = require('mongoose');
let fn = require('../utils/fn.js');
let ObjectId = mongoose.Types.ObjectId;
module.exports = function (app) {
    let exports = {},
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
                let item = data[0];
                let p = articleM.find({
                    is_product: false,
                    is_online_shop: false
                });
                let cids = Array.from(item.cids);
                let or = [];
                for (let cate of cids) {
                    or.push({
                        cids: ObjectId(cate.id)
                    });
                }
                let relatedProductPromise = articleM.find({
                    _id: {
                        $ne: ObjectId(item.id)
                    },
                    is_product: true,
                    is_online_shop: item.is_online_shop
                });
                Promise.all([
                    relatedProductPromise.or(or).sort({
                        'release_date': 'desc'
                    }),
                    p.or(or).sort({
                        'release_date': 'desc'
                    })
                ]).then((related_data) => {
                    let view = item.is_product ? 'product' : 'article';
                    res.render(view, {
                        title: item.name,
                        item: item,
                        bclists: data[1],
                        related_products: related_data[0],
                        related_news: related_data[1]
                    });
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

    exports.news = (req, res, next) => {
        let page = req.query.page ? (req.query.page - 1) : 0;
        let limit = 10;
        let newsCid = res.locals.newsCate ? res.locals.newsCate.id : '000000000000';
        articleM.pagination({
            cids: newsCid
        }, page, limit, {
            release_date: 'desc'
        }).then((data) => {
            if (!data[1]) return app.notFound(req, res, next);
            res.render('item_list', {
                title: '新闻',
                subtitle: 'NEWS',
                page: req.query.page,
                pageNums: Math.ceil(data[0] / limit),
                total: data[0],
                list: data[1],
                bclist: ['新闻']
            });
        });
    };

    return exports;
};
