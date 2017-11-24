module.exports = (() => {
    var fn = {};
    /*
    * 将数组目录按顺序转换为对象属性
    * [a,b,c] => obj.a.b.c.
    * @param Object obj 保存属性的对象
    * @param Array arr 目录数组
    * @param function cb 回调 function() {return x}
    * 将cb执行结果赋值给最后一个key
    */
    var toObjTree = (obj, arr, cb) => {
        let key = arr.shift();
        if(key) {
            if(!obj[key]) obj[key] = { };
            if(arr.length > 0) {
                toObjTree(obj[key], arr, cb);
            } else {
                if(typeof(cb) === 'function') {
                    obj[key] = cb();
                }
            }
        }
    };

    fn.toObjTree = toObjTree;

    return fn;
})();
