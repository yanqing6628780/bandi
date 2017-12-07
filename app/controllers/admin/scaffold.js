module.exports = function (app) {
    let Model,
        cateModel = app.models.categorys,
        title = '后台管理',
        view, url,
        obj = {};
    let getAllCategory = () => {
        return cateModel.getTree();
    };
    obj.parseParmas = (req, res, next) => {
        view = 'admin';
        url = '/admin/model';
        let err = new Error('找不到model');
        err.status = 400;
        if (req.params.model) {
            try {
                Model = app.models[req.params.model];
                view += `/${req.params.model}`;
                res.locals.url = url += `/${req.params.model}`;
                next();
            } catch (error) {
                next(err);
            }
        } else {
            next(err);
        }
    };
    obj.list = function (req, res, next) {
        Model.find()
            .populate('cid')
            .sort({ createdAt: 'desc' })
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

    obj.add = function (req, res) {
        getAllCategory().then((rs) => {
            res.render(`${view}/form`, {
                title: `${title}-添加`,
                categorys: rs
            });
        });
    };

    obj.edit = function (req, res, next) {
        if (req.params.id) {
            Model.findOne({
                    _id: req.params.id
                })
                .exec()
                .then(function (doc) {
                    getAllCategory()
                        .then((rs) => {
                            res.render(`${view}/form`, {
                                title: `${title}-编辑`,
                                model: doc.toObject(),
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

    obj.save = function (req, res, next) {
        if (req.body.id) {
            Model.findOne({
                    _id: req.body.id
                })
                .exec()
                .then(function (document) {
                    if (!document) return next();
                    for (let key in req.body) {
                        document[key] = req.body[key];
                    }
                    if (!req.body.parent_id) {
                        document.parent_id = null;
                    }
                    if (!req.body.price) {
                        document.price = 0;
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
            let newModel = new Model(req.body);
            // save user to database
            newModel.save()
                .then(function () {
                    res.redirect(url);
                }).catch(function (err) {
                    return next(err);
                });
        }
    };

    obj.del = function (req, res, next) {
        if (req.params.id) {
            Model.remove({
                _id: req.params.id
            }, function (err) {
                if (err) next(err);
            });
        }
        res.redirect(url);
    };

    return obj;
};
