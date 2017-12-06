let mongoose = require('mongoose');
let fn = require('../utils/fn.js');
module.exports = function (app) {
    let exports = {},
        ArticleM = app.models.articles,
        AdModel = app.models.ad,
        CategoryM = app.models.categorys;
    let _category_root = (rs, req, res) => {
        return res.render('category_root', {
            item: rs
        });
    };
    let _category = (rs, req, res, next) => {
        let where = {
            cids: rs.id
        };
        let page = req.query.page ? (req.query.page - 1) : 0;
        let limit = 10;
        ArticleM.pagination(where, page, limit).then((data) => {
            if (!data[1]) return next(new Error('404'));
            res.render('item_list', {
                title: rs.display_name,
                subtitle: rs.name,
                bclist: [rs.display_name],
                page: req.query.page,
                pageNums: Math.ceil(data[0] / limit),
                list: data[1]
            });
        });
    };
    let _product_cateogry = (rs, req, res, next) => {
        let where = {
            is_product: true,
            cids: rs.id
        };
        let page = req.query.page ? (req.query.page - 1) : 0;
        let limit = 10;
        let sort = fn.parseSort(req);
        Promise.all([
            ArticleM.pagination(fn.parseWhere(req, where), page, limit, sort),
            CategoryM.findTree(rs.id),
            AdModel.find({ cid: rs.id })
        ]).then((result) => {
            let data = result[0];
            if (!data[1]) return next(new Error('404'));
            let bclists = result[1];
            let selectName = rs.parent_id.name == 'brand' ? 'series' : 'brand';
            let selectOpts = res.locals.category[bclists[0].name][selectName];
            res.render('category', {
                title: rs.display_name,
                subtitle: rs.name,
                cate_detail: rs,
                query: req.query,
                page: req.query.page,
                pageNums: Math.ceil(data[0] / limit),
                total: data[0],
                list: data[1],
                bclists: bclists,
                selectOpts: selectOpts,
                selectName: selectName,
                ad_list: result[2]
            });
        });
    };
    exports.index = (req, res, next) => {
        let id;
        try {
            id = mongoose.Types.ObjectId(req.params.id);
        } catch (error) {
            return app.notFound(req, res, next);
        }
        CategoryM.findOne({
            _id: id
        }).populate('parent_id').exec().then((rs) => {
            if (!rs) return next(new Error('404'));
            return rs;
        }).then((rs) => {
            if (rs.name == "GUNPLA" || rs.name == "CHARACTER") {
                return _category_root(rs, req, res, next);
            }
            if (rs.name == "EVENT" || rs.name == "CAMPAIGN") {
                return _category(rs, req, res, next);
            }
            return _product_cateogry(rs, req, res, next);
        });
    };


    return exports;
};
