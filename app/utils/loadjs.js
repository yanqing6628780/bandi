const glob = require("glob");
const path = require('path');
const fn = require('./fn.js');

/**
 * 按目录结构加载所有JS文件
 * example: [admin/user/a.js,admin/test/a.js,api/a.js] =>
 * {
 *     admin: {
 *         user: { a: [Function] }
 *         test: { a: [Function] }
 *     },
 *     api: { a: [Function] }
 * }
 * @param  {[string]} filePattern glob文件匹配模式
 * @param  {[array]} args require js文件所需要的参数数组
 * @return {[object]} 按目录结构的构造的对象
 */
module.exports = function(options, args) {
    let ctrl = {},
        dir = options.dir ? options.dir : __dirname,
        filePattern = options.filePattern ? options.filePattern : '**/*.js',
        pattern = dir + filePattern;

    glob.sync(pattern).forEach(file => {
        let parse = path.parse(file);
        let relPath = path.relative(dir, parse.dir);
        let dirArr = relPath.split(path.sep);
        if (relPath == '') {
            dirArr = [parse.name];
        } else {
            dirArr.push(parse.name);
        }
        fn.toObjTree(ctrl, dirArr, () => {
            return require(file).apply(null, args);
        });
    });
    return ctrl;
};
