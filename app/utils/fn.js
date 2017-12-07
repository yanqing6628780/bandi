let _ = require('lodash');
let mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId;
module.exports = (() => {
    let fn = {};
    /*
     * 将数组目录按顺序转换为对象属性
     * [a,b,c] => obj.a.b.c.
     * @param Object obj 保存属性的对象
     * @param Array arr 目录数组
     * @param function cb 回调 function() {return x}
     * 将cb执行结果赋值给最后一个key
     */
    let toObjTree = (obj, arr, cb) => {
        let key = arr.shift();
        if (key) {
            if (!obj[key]) obj[key] = {};
            if (arr.length > 0) {
                toObjTree(obj[key], arr, cb);
            } else {
                if (typeof (cb) === 'function') {
                    obj[key] = cb();
                }
            }
        }
    };

    fn.parseSort = (req) => {
        let sort = {
            release_date: 'desc'
        };
        if (req.query.sort) {
            switch (req.query.sort) {
                case 'old':
                    sort.release_date = 'asc';
                    break;
                case 'low':
                    sort.price = 'asc';
                    delete sort.release_date;
                    break;
                case 'high':
                    sort.price = 'desc';
                    delete sort.release_date;
                    break;
                default:
                    sort.release_date = 'desc';
                    break;
            }
        }
        return sort;
    };

    fn.parseWhere = (req, where) => {
        if (req.query.cid) {
            let cid = where.cids;
            where.cids = [];
            where.cids.push(req.query.cid, cid);
            where.cids = _.compact(where.cids);
        }
        if (req.query.cids) {
            let arr = _.compact(req.query.cids);
            where.cids = arr.map(ObjectId);
        }

        if (req.query.online) {
            where.is_online_shop = true;
        }

        if (req.query.signle_cid) {
            where.cids = req.query.signle_cid;
        }
        if (req.query.name) {
            where.name = { $regex: new RegExp(req.query.name)};
        }

        if (where.cids && _.isEmpty(where.cids)) {
            delete where.cids;
        }
        for(let k in req.query) {
            if (~['name', 'cid', 'cids', 'online', 'signle_cid', 'sort'].indexOf(k)) {
                continue;
            }
            if(req.query[k] !== '') {
                where[k] = req.query[k];
            }
        }
        return where;
    };

    fn.toObjTree = toObjTree;

    return fn;
})();
