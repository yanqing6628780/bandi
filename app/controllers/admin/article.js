let fn = require('../../utils/fn');
module.exports = function(app) {
    var Model = app.models.articles,
        cateModel = app.models.categorys,
        view = 'admin/article',
        url = '/admin/article',
        title = '后台文章管理',
        exports = {};
    var getAllCategory = () => {
        return cateModel.getTree();
    };
    exports.list = function(req, res, next) {
        let where = fn.parseWhere(req, {});
        Model.find(where)
            .populate('cids')
            .sort({ createdAt: 'desc'})
            .exec()
            .then(function(result) {
                getAllCategory().then((rs) => {
                    res.render(view, {
                        title: title,
                        list: result,
                        categorys: rs,
                        query: req.query
                    });
                });
            }).catch(function(err) {
                return next(err);
            });
    };

    exports.add = function(req, res) {
        getAllCategory().then((rs) => {
            res.render(`${view}/form`, {
                title: `${title}-添加`,
                categorys: rs
            });
        });
    };

    exports.edit = function(req, res, next) {
        if (req.params.id) {
            Model.findOne({
                    _id: req.params.id
                })
                .exec()
                .then(function(doc) {
                    getAllCategory()
                        .then((rs) => {
                            res.render(`${view}/form`, {
                                title: `${title}-编辑`,
                                model: doc.toObject(),
                                categorys: rs
                            });
                        });
                })
                .catch(function(err) {
                    return next(err);
                });
        } else {
            return res.status(404).send('Not found');
        }
    };

    exports.save = function(req, res, next) {
        if (req.body.id) {
            Model.findOne({
                    _id: req.body.id
                })
                .exec()
                .then(function(document) {
                    if (!document) return next();
                    for (var key in req.body) {
                        document[key] = req.body[key];
                    }
                    if (!req.body.parent_id) {
                        document.parent_id = null;
                    }
                    if (!req.body.price) {
                        document.price = 0;
                    }
                    document.save()
                        .then(function() {
                            res.redirect(url);
                        }).catch(function(err) {
                            return next(err);
                        });
                }).catch(function(err) {
                    return next(err);
                });
        } else {
            if (!req.body.parent_id) {
                delete req.body.parent_id;
            }
            var newModel = new Model(req.body);
            // save user to database
            newModel.save()
                .then(function() {
                    res.redirect(url);
                }).catch(function(err) {
                    return next(err);
                });
        }
    };

    exports.del = function(req, res, next) {
        if (req.params.id) {
            Model.remove({
                _id: req.params.id
            }, function(err) {
                if (err) next(err);
            });
        }
        res.redirect(url);
    };

    return exports;
};
