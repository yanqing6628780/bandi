var mongoose = require('mongoose');
module.exports = function (app) {
    var exports = {},
        articleM = app.models.articles,
        categoryM = app.models.categorys;
    exports.detail = (req, res, next) => {
        articleM.findOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            })
            .populate('cids')
            .exec()
            .then((rs) => {
                if (!rs) return next(new Error('404'));
                let p = [];
                for (let x of Array.from(rs.cids)) {
                    p.push(categoryM.findTree(x.id))
                }
                return Promise.all(p).then((bclists) => {
                    return [rs, bclists];
                })
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

    return exports;
};
