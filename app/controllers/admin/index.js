'use strict';

module.exports = function (app) {
    var exports = {};
    exports.home = function(req, res) {
        res.render('admin/index', { title: '管理后台' });
    };

    return exports;
};
