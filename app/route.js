'use strict';

const express = require('express');
const loadjs = require('./utils/loadjs');
var ueditor = require("ueditor");
var upload = require('jquery-file-upload-middleware');
var path = require('path');
var fs = require('fs');

module.exports = function(app, passport) {

    //加载控制器
    var ctrlDir = `${__dirname}/controllers/`;
    var controllers = loadjs({
        dir: ctrlDir
    }, [app]);

    //加载中间件
    var midDir = `${__dirname}/middlewares/`;
    var middlewares = loadjs({
        dir: midDir
    }, [app, passport]);

    var adminCtrl = controllers.admin;
    var midAuth = middlewares.authorization;

    var frontPage = express.Router();

    //routerPage下的views上使用下面的数据
    frontPage.use(middlewares.view.getCommonData);

    frontPage.get('/', controllers.index.home);
    // routerPage.get('/', (req, res) => res.redirect('/admin'));
    frontPage.get('/schedule/:date?', controllers.index.schedule);
    frontPage.get('/item/:id', controllers.item.detail);
    frontPage.get('/items/', controllers.item.all);
    frontPage.get('/online_item', controllers.item.online);
    frontPage.get('/category/:id', controllers.category.index);
    frontPage.get('/news', controllers.item.news);

    app.use('/', frontPage);

    // 后台
    var adminRouter = express.Router();
    //后台鉴权
    adminRouter.use(midAuth.admin.hasAuthorization);
    //后台管理路由
    adminRouter.get('/', adminCtrl.index.home);
    adminRouter.get('/login', adminCtrl.auth.login);
    adminRouter.post('/login', adminCtrl.auth.doLogin);
    adminRouter.get('/logout', adminCtrl.auth.logout);
    adminRouter.use("/ueditor/ue", ueditor(app.configs.path.public, (req, res) => {

        // ueditor 客户发起上传图片请求

        if (req.query.action === 'uploadimage') {

            // 这里你可以获得上传图片的信息
            // var foo = req.ueditor;
            // console.log(foo.filename); // exp.png
            // console.log(foo.encoding); // 7bit
            // console.log(foo.mimetype); // image/png

            // 下面填写你要把图片保存到的路径 （ 以 path.join(__dirname, 'public') 作为根路径）
            var img_url = '/uploads/';
            res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        }
        //  客户端发起图片列表请求
        else if (req.query.action === 'listimage') {
            var dir_url = '/uploads/'; // 要展示给客户端的文件夹路径
            res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
        } else { // 客户端发起其它请求
            res.setHeader('Content-Type', 'application/json');
            // 这里填写 ueditor.config.json 这个文件的路径
            res.redirect('/js/lib/ueditor/ueditor.config.json');
        }
    }));

    adminRouter.delete('/upload', (req, res) => {
        if (req.body.dir && req.body.filename) {
            var filepath = path.join(app.configs.path.public, req.body.dir, req.body.filename);
            fs.unlink(filepath, function(ex) {
                res.json({
                    success: !ex
                });
            });
            return;
        }
        res.json({
            success: false,
            error: "请提供文件名和目录名"
        });
    });

    adminRouter.post('/upload', (req, res, next) => {
        var uploadUrl = "/products";
        var uploadDir = path.join(app.configs.path.public, uploadUrl);
        if (req.query.dir) {
            uploadDir = path.join(app.configs.path.public, req.query.dir);
            uploadUrl = req.query.dir;
        }
        upload.fileHandler({
            uploadDir: uploadDir,
            uploadUrl: uploadUrl
        })(req, res, next);
    });


    var methods = [{
                url: '/',
                ctrl: 'list',
                method: 'get'
            },
            {
                url: '/add',
                ctrl: 'add',
                method: 'get'
            },
            {
                url: '/edit/:id',
                ctrl: 'edit',
                method: 'get'
            },
            {
                url: '/save',
                ctrl: 'save',
                method: 'post'
            },
            {
                url: '/delete/:id',
                ctrl: 'del',
                method: 'get'
            }
        ],
        routersObj = {
            adminUserRouter: {
                url: 'user',
                namespace: 'user',
                methods: methods
            },
            adminCategoryRouter: {
                url: 'category',
                namespace: 'category',
                methods: methods
            },
            adminArticle: {
                url: 'article',
                namespace: 'article',
                methods: methods
            },
            adminSlider: {
                url: 'index_slider',
                namespace: 'index_slider',
                methods: methods
            },
            adminWebCfg: {
                url: 'web_config',
                namespace: 'web_config',
                methods: methods
            }
        };
    var adminRouterObj = {};
    for (var key in routersObj) {
        var it = routersObj[key];
        var router = express.Router({
            mergeParams: true
        });
        adminRouterObj[key] = router;
        for (var _k in it.methods) {
            var m = it.methods[_k];
            router[m.method](m.url, adminCtrl[it.namespace][m.ctrl]);
        }
        adminRouter.use(`/${it.url}`, router);
    }
    app.use('/admin', adminRouter);

    // catch 404 and forward to error handler
    app.notFound = (req, res, next) => {
        var err = new Error('Not Found');
        err.status = 404;
        return next(err);
    };

    // error handlers
    var errroHandlers = (err, req, res, next) => {
        // development error handler
        // will print stacktrace
        if (app.get('env') === 'development' || app.get('env') === 'test') {
            console.error('链接:%s 应用错误', req.originalUrl);
            console.error(err);
            if (res.headersSent) {
                return next(err);
            }
        } else {
            app.log.dateLogger.error('链接:' + req.originalUrl + ' 应用错误');
            app.log.dateLogger.error(err);
        }
        // production error handler
        // no stacktraces leaked to user
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    };

    app.use(errroHandlers);
};
