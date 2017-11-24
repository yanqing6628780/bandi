'use strict';

var log4js = require('log4js'),
    configs = require('../../config/');

log4js.configure({
    appenders: [{
            type: 'console',
            category: "console"
        }, //控制台输出
        {
            type: "dateFile",
            filename: '/log.log',
            pattern: "_yyyy-MM-dd",
            alwaysIncludePattern: false,
            category: 'dateFileLog'
        } //日期文件格式
    ],
    replaceConsole: true, //替换console.log
    levels: {
        "dateFileLog": 'ALL',
        "console": "ALL"
    }
}, { cwd: configs.path.logs });

var dateLogger = log4js.getLogger('dateFileLog');

exports.use = function(app) {
    //页面请求日志, level用auto时,默认级别是WARN
    app.use(log4js.connectLogger(dateLogger, { level: 'debug', format: ':method :url' }));
    app.logger = dateLogger;
}
