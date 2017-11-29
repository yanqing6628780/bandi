module.exports = function(app) {
    var exports = {};
    exports.requiresLogin = function(req, res, next) {
        if (req.isAuthenticated()) return next();
        if (req.method == 'GET') req.session.returnTo = req.originalUrl;
        res.redirect('/login');
    };


    exports.admin = {
        hasAuthorization: function (req, res, next) {
            if (req.path == '/login') return next();
            if (req.path == '/logout') return next();
            if (req.session.admin) {
                res.locals.admin = req.session.admin;
                return next();
            }

            res.redirect('/admin/login');
        },
    }

    return exports;
}
