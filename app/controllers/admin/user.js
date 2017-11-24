module.exports = function (app) {
    var User = app.models.users;

    var exports = {};
    exports.list = function (req, res, next) {
        User.find()
            .exec()
            .then(function (result) {
                res.render('admin/user', {
                    title: '管理后台用户',
                    list: result
                });
            }).catch(function (err) {
                return next(err);
            });
    };

    exports.add = function (req, res) {
        res.render('admin/user/form', {
            title: '管理后台用户-添加'
        });
    };

    exports.edit = function (req, res, next) {
        if (req.params.id) {
            User.findOne({
                    _id: req.params.id
                }).exec()
                .then(function (user) {
                    res.render('admin/user/form', {
                        title: '管理后台用户-编辑',
                        model: user
                    });
                }).catch(function (err) {
                    return next(err);
                });
        } else {
            return res.status(404).send('Not found');
        }
    };

    exports.save = function (req, res, next) {
        if (req.body.id) {
            User.findOne({
                    _id: req.body.id
                })
                .exec()
                .then(function (user) {
                    var save = () => {
                        user.save()
                            .then(function () {
                                res.redirect('/admin/user');
                            }).catch(function (err) {
                                return next(err);
                            });
                    };
                    if (req.body.password.length === 0) {
                        delete req.body.password;
                    }

                    for (var key in req.body) {
                        user[key] = req.body[key];
                    }
                    if (user.isban === true) {
                        checkUserNumber(req, res, save);
                    } else {
                        save();
                    }
                }).catch(function (err) {
                    return next(err);
                });
        } else {
            var newUser = new User(req.body);

            // save user to database
            newUser.save()
                .then(function () {
                    res.redirect('/admin/user');
                }).catch(function (err) {
                    return next(err);
                });
        }
    };

    exports.del = function (req, res, next) {
        var remove = () => {
            return User.remove({ _id: req.params.id }, function (err) {
                if (err) next(err);
                res.redirect('/admin/user');
            });
        };
        if (req.params.id) {
            checkUserNumber(req, res, remove);
            return;
        }
        res.redirect('/admin/user');
    };

    function checkUserNumber(req, res, cb) {
        return User.count().then((rs) => {
            if(rs === 1) {
                req.flash('errors', '后台必须至少有一个用户可用');
                return res.redirect('back');
            } else {
                cb();
            }
        });
    }

    return exports;
};
