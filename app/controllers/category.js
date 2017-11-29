var mongoose = require('mongoose');
module.exports = function (app) {
    var exports = {},
        articleM = app.models.articles,
        categoryM = app.models.categorys;
    exports.index = (req, res, next) => {
        categoryM.findOne({
            _id: mongoose.Types.ObjectId(req.params.id)
        }).exec().then((rs) => {
            if (!rs) return next(new Error('404'));
            return rs;
        }).then((rs) => {
            let view = 'category';
            console.log(rs)
            if (rs.name == "GUNPLA" || rs.name == "CHARACTER") {
                view = 'category_root';
            }
            res.render(view, {
                item: rs
            });
        });
    };

    return exports;
};
