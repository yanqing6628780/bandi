module.exports = function (app) {
    var Model = app.models.categorys,
        view = 'admin/category',
        url = '/admin/category',
        title = '后台栏目管理',
        exports = {};
    exports.list = function (req, res, next) {
        Model.getTree().then(function (result) {
            res.render(view, {
                title: title,
                list: result
            });
        }).catch(function (err) {
            return next(err);
        });
    };

    exports.add = function (req, res) {
        res.render(`${view}/form`, {
            title: `${title}-添加`,
            parent_id: req.query.parent_id ? req.query.parent_id : 'null'
        });
    };

    exports.edit = function (req, res, next) {
        if (req.params.id) {
            Model.findOne({
                    _id: req.params.id
                })
                .exec()
                .then(function (doc) {
                    res.render(`${view}/form`, {
                        title: `${title}-编辑`,
                        model: doc
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
                    if (!document) return next();
                    for (var key in req.body) {
                        document[key] = req.body[key];
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
            Model.findOneAndRemove({
                _id: req.params.id
            }, function (err) {
                if (err) next(err);
            });
        }
        res.redirect(url);
    };

    return exports;
};
