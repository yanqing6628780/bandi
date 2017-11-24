'use strict';

module.exports = function (app) {

    var adminUser = app.models.users;
    var exports = {};

    exports.login = function (req, res) {
        res.render('admin/login', { title: '登录' });
    };

    exports.logout = function (req, res) {
        delete req.session.admin;
        res.redirect('/admin/login');
    };

    exports.doLogin = function (req, res, next) {
        const criteria = { username: req.body.username, password: req.body.password };
        adminUser.getAuthenticated(criteria, function (err, user, reason) {
            if (err) return next(err);
            if (user) {
                req.session.admin = user;
                res.redirect('/admin');
            } else {
                var reasons = adminUser.getFailReasons();
                switch (reason) {
                    case reasons.FAIL:
                        req.flash('errors', '用户名或密码错误');
                        return res.redirect('back');
                    case reasons.MAX_ATTEMPTS:
                        // send email or otherwise notify user that account is
                        // temporarily locked
                        req.flash('errors', '登录尝试失败过多');
                        return res.redirect('back');
                    case reasons.BAN:
                        req.flash('errors', '该用户被禁止登录');
                        return res.redirect('back');
                }
            }
        });
    };

    return exports;
};
