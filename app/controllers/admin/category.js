module.exports = function (app) {
    var Model = app.models.categorys,
        view = 'admin/category',
        url = '/admin/category',
        title = '后台分类管理',
        exports = {};
    var getAllCategory = (conditions, next) => {
        return Model.find(conditions)
            .exec()
            .catch((err) => next(err));
    };
    exports.list = function (req, res, next) {
        Model.find()
            .populate('parent_id')
            .exec()
            .then(function (result) {
                res.render(view, {
                    title: title,
                    list: result
                });
            }).catch(function (err) {
                return next(err);
            });
    };

    exports.add = function (req, res, next) {
        getAllCategory({}, next).then((rs) => {
            res.render(`${view}/form`, {
                title: `${title}-添加`,
                categorys: rs
            });
        });
    };

    exports.edit = function (req, res, next) {
        if (req.params.id) {
            Model.findOne({
                    _id: req.params.id
                })
                .populate('children')
                .exec()
                .then(function (doc) {
                    getAllCategory({
                            _id: {
                                $ne: req.params.id
                            }
                        }, next)
                        .then((rs) => {
                            res.render(`${view}/form`, {
                                title: `${title}-编辑`,
                                model: doc,
                                categorys: rs
                            });
                        });
                })
                .catch(function (err) {
                    return next(err);
                });
        } else {
            return res.status(404).send('Not found');
        }
    };

    exports.save = function (req, res, next) {
        if (req.body.id) {
            Model.findOne({
                    _id: req.body.id
                })
                .exec()
                .then(function (document) {
                    if(!document) return next();
                    for (var key in req.body) {
                        document[key] = req.body[key];
                    }
                    if (!req.body.parent_id) {
                        document.parent_id = null;
                    }
                    document.save()
                        .then(function () {
                            res.redirect(url);
                        }).catch(function (err) {
                            return next(err);
                        });
                }).catch(function (err) {
                    return next(err);
                });
        } else {
            if (!req.body.parent_id) {
                delete req.body.parent_id;
            }
            var newModel = new Model(req.body);
            // save user to database
            newModel.save()
                .then(function () {
                    res.redirect(url);
                }).catch(function (err) {
                    return next(err);
                });
        }
    };

    exports.del = function (req, res, next) {
        if (req.params.id) {
            Model.remove({
                _id: req.params.id
            }, function (err) {
                if (err) next(err);
            });
        }
        res.redirect(url);
    };

    return exports;
};
